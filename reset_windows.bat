@echo off
echo This will RESET all NeuroQuery data!
echo All uploaded documents and user data will be deleted.
echo.
set /p confirm="Are you sure? (type 'yes' to confirm): "
if /i not "%confirm%"=="yes" (
    echo Reset cancelled.
    pause
    exit /b 0
)

echo.
echo Stopping and removing containers...
docker-compose down -v

echo.
echo Removing Docker images...
docker rmi neuroquery-backend neuroquery-frontend

echo.
echo Cleaning up temporary files...
del /q .env 2>nul
rmdir /s /q data\uploads 2>nul
mkdir data\uploads
rmdir /s /q logs 2>nul
mkdir logs

echo.
echo NeuroQuery has been reset.
echo Run 'run_windows.bat' to start fresh.
pause