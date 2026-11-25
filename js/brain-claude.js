// Claude brain: talks to bridge/lux_bridge.py on localhost, which calls `claude -p`.
// Only active when the page is served by the bridge.
window.LUX = window.LUX || {};

LUX.ClaudeBrain = (() => {
  async function available() {
    if (location.protocol === "file:") return false;
    try {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 1500);
      const r = await fetch("/api/status", { signal: ctrl.signal });
      return r.ok && (await r.json()).claude === true;
    } catch {
      return false;
    }
  }

  async function reply({ message, events = [], state }) {
    const r = await fetch("/api/talk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, events, state }),
    });
    if (!r.ok) throw new Error(`bridge said ${r.status}: ${await r.text()}`);
    const data = await r.json();
    return {
      text: data.text,
      expression: data.expression || "neutral",
      events: [...new Set([...events, ...(data.events || [])])],
      effects: {},
    };
  }

  return { name: "claude", available, reply };
})();
