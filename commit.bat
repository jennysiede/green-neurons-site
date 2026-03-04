@echo off
:: ─────────────────────────────────────────────────────────────
:: Green Neurons — Git Commit Script
:: Usage: commit.bat "your commit message"
::   or just: commit.bat   (uses a timestamped default message)
:: ─────────────────────────────────────────────────────────────

cd /d "%~dp0"

:: Check git is available
where git >nul 2>&1
if errorlevel 1 (
    echo ERROR: git not found. Install Git for Windows and try again.
    pause
    exit /b 1
)

:: Status check
echo.
echo ── Current status ──────────────────────────────
git status
echo ────────────────────────────────────────────────
echo.

:: Build commit message
if "%~1"=="" (
    for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set D=%%c-%%a-%%b
    for /f "tokens=1-2 delims=: " %%a in ("%time%") do set T=%%a%%b
    set MSG=update %D% %T%
) else (
    set MSG=%~1
)

:: Stage all changes
git add -A

:: Confirm before committing
echo About to commit: "%MSG%"
echo.
set /p CONFIRM=Proceed? [Y/n]: 
if /i "%CONFIRM%"=="n" (
    echo Aborted.
    exit /b 0
)

git commit -m "%MSG%"

echo.
echo ── Commit complete ─────────────────────────────
git log --oneline -5
echo ────────────────────────────────────────────────
echo.

:: Optional push
set /p DOPUSH=Push to remote now? [Y/n]: 
if /i not "%DOPUSH%"=="n" (
    git push
    echo Pushed.
)

echo Done.
pause
