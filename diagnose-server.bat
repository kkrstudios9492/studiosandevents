@echo off
echo ========================================
echo    Server Diagnosis Tool
echo ========================================
echo.

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
) else (
    echo SUCCESS: Python is installed
)
echo.

echo Checking current directory...
echo Current directory: %CD%
echo.
echo Files in current directory:
dir /b *.html
echo.

echo Checking if port 8000 is available...
netstat -an | findstr :8000
if %errorlevel% equ 0 (
    echo WARNING: Port 8000 is already in use
    echo Trying port 8080 instead...
    echo.
    echo Starting server on port 8080...
    echo Open: http://localhost:8080
    echo.
    echo Press Ctrl+C to stop the server
    python -m http.server 8080
) else (
    echo Port 8000 is available
    echo.
    echo Starting server on port 8000...
    echo Open: http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    python -m http.server 8000
)
