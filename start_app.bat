@echo off
:: Windows: Double-click this file to start the presentation.
cd /d "%~dp0"
python start.py
if errorlevel 1 pause
