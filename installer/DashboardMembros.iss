; Script de exemplo para Inno Setup - Instalador do Sistema de Membros
; Gere o instalador usando o Inno Setup Compiler

[Setup]
AppName=Dashboard de Membros
AppVersion=1.0
DefaultDirName={pf}\DashboardMembros
DefaultGroupName=DashboardMembros
UninstallDisplayIcon={app}\frontend\favicon.ico
OutputDir=.
OutputBaseFilename=DashboardMembrosSetup
Compression=lzma
SolidCompression=yes

[Files]
Source: "..\dist\*"; DestDir: "{app}\frontend"; Flags: recursesubdirs
Source: "..\backend\*"; DestDir: "{app}\backend"; Flags: recursesubdirs
Source: "..\installer\start.bat"; DestDir: "{app}"; Flags: ignoreversion
; Inclua Node.js portátil e PostgreSQL se desejar
; Source: "..\nodejs\*"; DestDir: "{app}\nodejs"; Flags: recursesubdirs
; Source: "..\postgresql\*"; DestDir: "{app}\postgresql"; Flags: recursesubdirs

[Icons]
Name: "{group}\Dashboard de Membros"; Filename: "{app}\start.bat"
Name: "{userdesktop}\Dashboard de Membros"; Filename: "{app}\start.bat"; Tasks: desktopicon

[Run]
Filename: "{app}\start.bat"; Description: "Iniciar o sistema agora"; Flags: postinstall nowait

[Tasks]
Name: "desktopicon"; Description: "Criar atalho na área de trabalho"; GroupDescription: "Opções adicionais:"
