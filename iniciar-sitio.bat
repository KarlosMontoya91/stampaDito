@echo off
chcp 65001 >nul
echo Iniciando servidor local para StampaDito en http://localhost:8080 ...
start "" "http://localhost:8080"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0iniciar-sitio.ps1" -Port 8080
