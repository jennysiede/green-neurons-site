@echo off
:: tracker_update.bat
:: Double-click this file (or schedule it) to update the tracker and deploy.
cd /d "%~dp0"
python tracker_update.py
pause
