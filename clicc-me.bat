@echo off

:: Start the Windows Subsystem for Linux and run the script
:: This makes it work without an issue in VS Code on Windows,
:: but I guess you could also listen to the file name and just "clicc" it.
wsl bash -c "./run-server.sh"