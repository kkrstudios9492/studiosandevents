@echo off
echo Starting local server for OAuth testing...
echo.
echo This will start a local web server on http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause
