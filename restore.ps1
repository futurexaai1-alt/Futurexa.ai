# Database Restore Script for Futurexa.ai
# WARNING: This will overwrite the current database!

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

$env:PGPASSWORD = 'iqb8kWnxB2791a0i'
$pgRestoreBin = 'C:\Program Files\PostgreSQL\17\bin\pg_restore.exe'

Write-Host ""
Write-Host "WARNING: This will overwrite the current database!" -ForegroundColor Red
Write-Host "Backup file: $BackupFile" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Are you sure you want to continue? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Restore cancelled." -ForegroundColor Green
    exit 0
}

Write-Host "Starting restore..." -ForegroundColor Cyan

& $pgRestoreBin -h db.efootsmlltfdsqfxtwdo.supabase.co -p 5432 -U postgres -d postgres --schema=public --clean --if-exists $BackupFile 2>&1