@rem This script copies the web files to the dist folder

@echo off
setlocal

rem Create necessary directories if they don't exist
if not exist .\dist (
    mkdir .\dist
)
if not exist .\dist\web (
    mkdir .\dist\web
)

rem Remove existing directories
rmdir /s /q .\dist\web\public
rmdir /s /q .\dist\web\html

rem Create new directories
mkdir .\dist\web\public
mkdir .\dist\web\html

rem Copy files from source to destination
xcopy .\src\web\public .\dist\web\public /E /I
xcopy .\src\web\html .\dist\web\html /E /I

endlocal
@echo on
