"""DJ.LUX Claude bridge.

Serves the DJ.LUX app on http://localhost:8642 and forwards chat to the Claude Code CLI
(`claude -p`), so Anna gets a real brain without any API keys in the browser.

Usage:  python3 bridge/lux_bridge.py           (from the game folder)
Env:    LUX_MODEL=sonnet|haiku|opus             (default: haiku, it's fast)
        LUX_PORT=8642
        LUX_NO_BROWSER=1                         (don't auto-open the browser)
"""
import json
import os
import shutil
import subprocess
import tempfile
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = int(os.environ.get("LUX_PORT", "8642"))
MODEL = os.environ.get("LUX_MODEL", "haiku")
CLAUDE = shutil.which("claude")
HISTORY_TURNS = 12

EXPRESSIONS = ["neutral", "happy", "excited", "dreamy", "shocked", "grumpy", "annoyed", "sad", "guilty", "shy",
               "sleepy", "hungover", "lounging", "busy", "proud", "party", "djing", "skiing"]
SITUATIONS = {
    "home": "at home in the collective in Kannikestredet, Trondheim",
    "sofa": "on the sofa at home watching «Skal vi danse» (Tuesday ritual, ideally with Sandra)",
    "school": "at school (NTNU, a maths teacher-education lecture)",
    "training": "at Monday «sirkeltrening» with TF in a gym hall (she arrived a bit late, as always)",
    "pils": "at TF-pils on Thursday at the bar Tyven with TF: pub quiz and beer, getting a bit tipsy",
    "vors": "at Saturday vors (pre-party) with the whole Molde folkehøgskule gang (Jenny, Hennie, Idunn...)",
    "hungover": "hungover on the sofa on Sunday, worried about what she did last night",
    "asleep": "asleep in her room (answers by mumbling/shouting from her room, very sleepy)",
    "dj": "DJ-ing as DJ LUX at JubileumsGalla 2026 TF at the restaurant Grafen",
    "ski": "out skiing in deep powder",
}
SCHEMA = {
    "type": "object",
    "properties": {
        "text": {"type": "string"},
        "expression": {"type": "string", "enum": EXPRESSIONS},
        "events": {"type": "array", "items": {"type": "string", "enum": ["ADAM"]}},
    },
    "required": ["text", "expression"],
}

CONVO_SCHEMA = {
    "type": "object",
    "properties": {
        "lines": {
            "type": "array", "minItems": 2, "maxItems": 5,
            "items": {
                "type": "object",
                "properties": {
                    "who": {"type": "string", "enum": ["anna", "guest"]},
                    "text": {"type": "string"},
                    "expression": {"type": "string", "enum": EXPRESSIONS},
                },
                "required": ["who", "text"],
            },
        },
    },
    "required": ["lines"],
}
GUEST_NAMES = {"hadi": "Hadi", "jenny": "Jenny", "adam": "Adam", "idunn": "Idunn", "hennie": "Hennie"}

history = []  # [(speaker, text)]
convo_history = []  # [(speaker, text)] – conversations with guests in the living room
lock = threading.Lock()


def build_system_prompt():
    parts = [(ROOT / "bridge" / "persona.md").read_text(encoding="utf-8")]
    for f in sorted((ROOT / "content").glob("*.js")):
        parts.append(f"\n### {f.name}\n```js\n{f.read_text(encoding='utf-8')}\n```")
    return "\n".join(parts)


def build_turn(message, events, state):
    lines = []
    if history:
        lines.append("Conversation so far:")
        lines += [f"{who}: {text}" for who, text in history[-HISTORY_TURNS:]]
        lines.append("")
    situation = SITUATIONS.get(state.get("context"), SITUATIONS["home"])
    lines.append(f"Now: {state.get('day', '?')} {state.get('time', '?')}. Anna is {situation}, "
                 f"mood: {state.get('moodLabel', 'neutral')}, wearing: {state.get('outfit', 'ski outfit')}.")
    lines.append(f"Meters: festlyst (party urge) {state.get('festlyst', 0):.0f}%, "
                 f"DIALEKT {state.get('dialekt', 90):.0f}% (100 = full Ål/Hallingdal dialect, 0 = shy Oslo-speak), "
                 f"ADAM-O-METER {state.get('adam', 0):.0f}%, DJ level {state.get('djLevel', 1)}, "
                 f"{state.get('gigs', 0)} gigs played, {state.get('skis', 0)} items in her SKI-magasin.")
    lines.append(f"Story: she is now at \"{state.get('chapter', '?')}\".")
    if state.get("dialekt", 90) < 50:
        lines.append("IMPORTANT: her DIALEKT meter is LOW – Oslo people are around and she is shy. This turn she MUST "
                     "answer in Oslo-style bokmål ('jeg', 'hva', 'ikke', 'liksom', 'sånn') – NOT Hallingdal – a bit "
                     "awkward and trying too hard to sound posh.")
    if state.get("sponsored"):
        lines.append("She is a Sponsored Skier now and very proud of it.")
    adam_level = state.get("adamLevel", "shy")
    lines.append({
        "shy": "ADAM level: SHY – if Adam comes up she denies/deflects ('vi snakkar ikkje om det'), blushing.",
        "open": "ADAM level: OPEN – she opens up a bit about Adam: little stories (Chamonix, kanelbullar, 'härligt', "
                "his beanie, Swedish words he taught her), still a bit awkward. Don't just say 'vi snakkar ikkje om det'.",
        "smitten": "ADAM level: SMITTEN – she gushes about Adam, then catches herself and pretends it's nothing.",
    }.get(adam_level, ""))
    if state.get("guest"):
        who = {"hadi": "Hadi (friend from Brønnøysund, full of fun facts, asks 'kem e han Edvin egt?')",
               "jenny": "Jenny (Molde folkehøgskule friend, speaks Oslo dialect, says 'SLAYYY', looks after Anna)",
               "adam": "Adam (the Swedish ski bum she doesn't talk about – she is flustered and blushing)",
               "idunn": "Idunn (Molde folkehøgskule friend from Hemsedal who speaks Oslo, gives massages, says 'tøm og røm')",
               "hennie": "Hennie (Molde folkehøgskule friend from Bygdøy, Oslo west end, VERY allergic to peanuts – Anna gets shy)",
               }.get(state["guest"], state["guest"])
        lines.append(f"{who} is visiting and standing in the living room right now. Anna can mention or talk to them.")
    if state.get("adamFever"):
        lines.append("Anna has ADAM FEVER right now: Adam just texted/called, she is blushing and can't stop "
                     "(awkwardly, evasively) coming back to Adam whatever the user says.")
    if state.get("name"):
        lines.append(f"The user's name is {state['name']}.")
    if events:
        lines.append(f"Required events this turn: {', '.join(events)}.")
    lines.append(f"User: {message}")
    return "\n".join(lines)


def situation_lines(state):
    situation = SITUATIONS.get(state.get("context"), SITUATIONS["home"])
    return [f"Now: {state.get('day', '?')} {state.get('time', '?')}. Anna is {situation}, "
            f"mood: {state.get('moodLabel', 'neutral')}, wearing: {state.get('outfit', 'ski outfit')}. "
            f"DIALEKT {state.get('dialekt', 90):.0f}%, ADAM-O-METER {state.get('adam', 0):.0f}%, "
            f"story chapter: \"{state.get('chapter', '?')}\"."]


def build_convo_turn(guest, message, state):
    name = GUEST_NAMES.get(guest, guest)
    lines = situation_lines(state)
    lines.append(f"{name} is visiting and is standing in the living room with Anna. The player (a friend in the room) "
                 f"can talk to both of them.")
    if convo_history:
        lines.append("Conversation so far:")
        lines += [f"{who}: {text}" for who, text in convo_history[-HISTORY_TURNS:]]
    if message:
        lines.append(f"The player says: {message}")
        lines.append(f"Write how {name} and Anna answer the player (2–4 short lines; they may also react to each other). "
                     f"Answer what the player actually said.")
    else:
        lines.append(f"Nobody has said anything for a while. Write a short, funny conversation (3–5 lines) between Anna "
                     f"and {name} – pick a new topic that fits them and the situation (don't repeat earlier topics).")
    lines.append('who = "guest" for ' + name + ', "anna" for Anna. expression = Anna\'s face on her lines.')
    return "\n".join(lines)


def ask_claude(message, events, state):
    return run_claude(build_system_prompt(), build_turn(message, events, state), SCHEMA)


def ask_convo(guest, message, state):
    system = build_system_prompt() + "\n\n" + (ROOT / "bridge" / "guests.md").read_text(encoding="utf-8")
    return run_claude(system, build_convo_turn(guest, message, state), CONVO_SCHEMA)


def run_claude(system_prompt, turn, schema):
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
        f.write(system_prompt)
        prompt_file = f.name
    try:
        cmd = [CLAUDE, "-p",
               "--output-format", "json",
               "--model", MODEL,
               "--system-prompt-file", prompt_file,
               "--json-schema", json.dumps(schema),
               "--tools", "",
               "--no-session-persistence"]
        proc = subprocess.run(cmd, input=turn, capture_output=True,
                              text=True, encoding="utf-8", timeout=120, cwd=tempfile.gettempdir())
    finally:
        os.unlink(prompt_file)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or proc.stdout.strip())
    out = json.loads(proc.stdout)
    reply = out.get("structured_output")
    if not reply:  # fall back to parsing the text result
        raw = out.get("result", "")
        reply = json.loads(raw[raw.find("{"): raw.rfind("}") + 1])
    return reply


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def end_headers(self):
        # always serve the newest files (otherwise the browser may keep running old game code)
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "/api/" in str(args[0] if args else ""):
            super().log_message(fmt, *args)

    def send_json(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/status":
            return self.send_json(200, {"claude": CLAUDE is not None, "model": MODEL})
        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/reset":
            history.clear()
            convo_history.clear()
            return self.send_json(200, {"ok": True})
        if self.path == "/api/convo":
            try:
                raw = self.rfile.read(int(self.headers.get("Content-Length", 0)))
                data = json.loads(raw.decode("utf-8", errors="replace"))
                guest, message = data.get("guest", "hadi"), data.get("message")
                with lock:
                    reply = ask_convo(guest, message, data.get("state", {}))
                    if message:
                        convo_history.append(("Player", message))
                    name = GUEST_NAMES.get(guest, guest)
                    for line in reply.get("lines", []):
                        convo_history.append((name if line.get("who") == "guest" else "Anna", line.get("text", "")))
                return self.send_json(200, reply)
            except Exception as e:
                print("Claude error (convo):", e)
                return self.send_json(502, {"error": str(e)})
        if self.path != "/api/talk":
            return self.send_json(404, {"error": "not found"})
        try:
            raw = self.rfile.read(int(self.headers.get("Content-Length", 0)))
            data = json.loads(raw.decode("utf-8", errors="replace"))
            message = data.get("message", "")
            with lock:
                reply = ask_claude(message, data.get("events", []), data.get("state", {}))
                history.append(("User", message))
                history.append(("Anna", reply["text"]))
            self.send_json(200, reply)
        except Exception as e:  # the app falls back to the offline brain
            print("Claude error:", e)
            self.send_json(502, {"error": str(e)})


if __name__ == "__main__":
    if not CLAUDE:
        print("Could not find the `claude` CLI on PATH – the app will use the offline brain.")
    url = f"http://localhost:{PORT}"
    print(f"DJ.LUX is running on {url}  (model: {MODEL})  – Ctrl+C to stop")
    if not os.environ.get("LUX_NO_BROWSER"):
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    ThreadingHTTPServer(("localhost", PORT), Handler).serve_forever()
