@echo off
setlocal
cd /d "%~dp0"

set PORT=3010
title Don't know Academy - local (port %PORT%)

echo.
echo  ========================================
echo   Don't know Academy - local host
echo   Port: %PORT%
echo  ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not in PATH.
  echo Install from https://nodejs.org and try again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies (first run only^)...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
  echo.
)

echo Starting site at http://localhost:%PORT%
echo Keep this window open while you use the site.
echo Press Ctrl+C to stop.
echo.

start "" "http://localhost:%PORT%"

call npm run dev -- -p %PORT%

echo.
echo Server stopped.
pause
