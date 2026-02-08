@echo off
echo ========================================
echo     STARTING NEUROQUERY RAG SYSTEM
echo ========================================
echo.

echo Step 1: Stopping existing processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul

echo Step 2: Starting Backend...
cd backend
start cmd /k "python fixed_backend.py"

echo Waiting 5 seconds for backend...
timeout /t 5 /nobreak >nul

echo Step 3: Testing Backend...
curl http://localhost:5000/api/health 2>nul && (
    echo ✅ Backend is running!
) || (
    echo ❌ Backend failed to start
    echo Please check the backend window for errors
)

echo Step 4: Starting Frontend...
cd ..\frontend
start cmd /k "npm start"

echo.
echo ========================================
echo     SYSTEM STARTED SUCCESSFULLY!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo 📊 Health: http://localhost:5000/api/health
echo.
echo Opening browser...
timeout /t 10 /nobreak >nul
start http://localhost:3000
start http://localhost:5000

echo.
echo If you see connection errors:
echo 1. Wait 30 seconds for React to compile
echo 2. Refresh browser (F5)
echo 3. Try: http://127.0.0.1:3000
echo.
pause