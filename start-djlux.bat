@echo off
REM Starts DJ.LUX with the Claude brain (needs Python 3 + Claude Code, logged in).
REM Without Claude: just double-click index.html instead.
cd /d "%~dp0"
where python >nul 2>nul && (python bridge\lux_bridge.py & goto :end)
where py >nul 2>nul && (py -3 bridge\lux_bridge.py & goto :end)
echo Fann ikkje Python. Installer Python 3 fra https://www.python.org/downloads/
echo (huk av "Add python.exe to PATH"), eller apne index.html for a spele utan Claude.
:end
pause
