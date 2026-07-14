@echo off
REM ============================================================
REM MemoTicaret baslatici (Windows)
REM Cift tiklayarak calistir. 2 komut penceresi acar (backend + frontend)
REM ve frontend hazir olunca tarayicida http://localhost:4200 acar.
REM ============================================================

cd /d "%~dp0"

start "MemoTicaret Backend" cmd /k "cd backend && npm run dev"
start "MemoTicaret Frontend" cmd /k "cd frontend && npm start"

echo Frontend derleniyor, hazir olunca tarayici acilacak...
timeout /t 20 /nobreak >nul
start "" http://localhost:4200
