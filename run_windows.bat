@echo off
echo Starting NeuroQuery Backend and Frontend...
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Install dependencies if needed
echo Installing dependencies...
pip install fastapi uvicorn python-multipart aiofiles >nul 2>&1
if errorlevel 1 (
    echo Failed to install dependencies. Trying with pip3...
    pip3 install fastapi uvicorn python-multipart aiofiles >nul 2>&1
)

REM Create uploads directory
if not exist uploads mkdir uploads

REM Start the backend server
echo Starting backend server on http://localhost:8000
start cmd /k "python server.py"

REM Wait a bit for server to start
timeout /t 3 /nobreak >nul

REM Open frontend in default browser
echo Opening frontend in browser...
start http://localhost:8000/docs

echo.
echo ============================================
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Health Check: http://localhost:8000/health
echo ============================================
echo.
echo Press any key to stop the servers...
pause >nul

REM Kill Python processes
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im python3.exe >nul 2>&1