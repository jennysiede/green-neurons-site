@echo off
:: tracker_fetch_and_deploy.bat
:: Fetches latest disruption signals, updates disruptions.json,
:: then deploys to greenneurons.us automatically.
:: Double-click to run, or schedule via Windows Task Scheduler.
cd /d "%~dp0"
echo.
echo === Green Neurons Tracker Fetch + Deploy ===
echo.
python tracker_fetch.py --deploy
pause
