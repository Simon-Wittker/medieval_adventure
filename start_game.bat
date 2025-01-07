@echo off
REM Install required dependencies
echo Installing dependencies with npm...
npm install

REM Attempt to fix potential issues with dependencies
echo Running npm audit fix...
npm audit fix

REM Check if port 8000 is already in use and terminate the process
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    echo Port 8000 is already in use. Terminating the process with PID %%a...
    taskkill /PID %%a /F
)

REM Start the Python HTTP server in the background
echo Starting the Python HTTP server...
start /b python -m http.server 8000

REM Wait briefly to ensure the server has started
timeout /t 2 > nul

REM Open the game in the default browser
echo Opening the game in the browser...
start http://127.0.0.1:8000/

REM Notify the user
echo The game is running! Press any key to stop the server...
pause

echo Server stopped.
pause
