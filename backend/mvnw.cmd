@REM ----------------------------------------------------------------------------
@REM Maven Wrapper for PARIHAARAM Backend
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF

SETLOCAL EnableDelayedExpansion

SET "MAVEN_CMD="

@REM Check if local extracted maven exists in workspace .tools
IF EXIST "%~dp0..\.tools\apache-maven-3.9.6\bin\mvn.cmd" (
    SET "MAVEN_CMD=%~dp0..\.tools\apache-maven-3.9.6\bin\mvn.cmd"
) ELSE (
    @REM Check if mvn is in PATH
    WHERE mvn >nul 2>nul
    IF %ERRORLEVEL% EQU 0 (
        SET "MAVEN_CMD=mvn"
    )
)

IF "%MAVEN_CMD%" == "" (
    ECHO [ERROR] Maven not found. Please ensure Maven 3.9+ is installed or in .tools directory.
    EXIT /B 1
)

CALL "%MAVEN_CMD%" %*
EXIT /B %ERRORLEVEL%
