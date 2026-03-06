@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "LOCAL_JDK=%SCRIPT_DIR%..\..\.tools\jdk17x\jdk-17.0.18+8"
set "ADVISOR_PORT=8084"

if not exist "%LOCAL_JDK%\bin\java.exe" (
  echo [ERROR] JDK 17 not found at:
  echo         %LOCAL_JDK%
  echo [ERROR] Install/configure JDK 17 and set JAVA_HOME, then retry.
  exit /b 1
)

set "JAVA_HOME=%LOCAL_JDK%"
set "PATH=%JAVA_HOME%\bin;%PATH%"

for /f %%P in ('powershell -NoProfile -Command "$p=Get-NetTCPConnection -LocalPort %ADVISOR_PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess; if($p){$p}"') do set "PORT_PID=%%P"

if defined PORT_PID (
  echo Port %ADVISOR_PORT% is in use by PID %PORT_PID%.
  powershell -NoProfile -Command "$p=Get-Process -Id %PORT_PID% -ErrorAction SilentlyContinue; if($p -and $p.ProcessName -ieq 'java'){Stop-Process -Id %PORT_PID% -Force; exit 0}; exit 2"
  if errorlevel 2 (
    echo [ERROR] Port %ADVISOR_PORT% is occupied by a non-Java process or could not be stopped.
    echo [ERROR] Stop PID %PORT_PID% manually and retry.
    exit /b 1
  )
  echo Cleared stale Java process on port %ADVISOR_PORT%.
)

echo Using JAVA_HOME=%JAVA_HOME%
"%JAVA_HOME%\bin\java.exe" -version

call "%SCRIPT_DIR%mvnw.cmd" spring-boot:run %*
exit /b %ERRORLEVEL%
