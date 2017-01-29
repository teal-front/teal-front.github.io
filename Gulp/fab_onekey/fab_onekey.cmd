@ECHO OFF
@CLS
SETLOCAL

REM *************************************************************
REM *             fenqile auto build plugin install             *
REM *                          wynn                             *
REM *                       2015.07.03                          *
REM *************************************************************

rem *************从http拉取npm list******************
rem IF EXIST npm.dat (
rem    @del /Q npm.dat > nul
rem )
rem @aria2c -o npm.dat "http://frd.fenqile.com/download/npm.dat" > nul
rem IF ERRORLEVEL 1 GOTO END
rem  *************end*************************

FOR /F %%f IN (npm.dat) DO (
    echo ***********************安装 [[ %%f ]]***********************
    call npm --registry http://registry.npm.frd.fenqile.com/ install -g %%f
    echo ***********************[[ %%f ]] 安装成功***********************
    echo.
)
rem *********删除下载后的npm list*************
rem @del /Q npm.dat > nul
rem **********end*****************************

FOR /F %%c IN ('npm config get prefix') DO (
    set ENV_VAR_CONFIG=SETX NODE_PATH %%c\node_modules
)

%ENV_VAR_CONFIG% > nul

:END

ENDLOCAL