#!/bin/sh
# Starts DJ.LUX with the Claude brain (needs Python 3 + Claude Code, logged in).
# Without Claude: just open index.html in a browser instead.
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then exec python3 bridge/lux_bridge.py
elif command -v python >/dev/null 2>&1; then exec python bridge/lux_bridge.py
else echo "Fann ikkje Python 3 – installer det, eller opne index.html for å spele utan Claude."; fi
