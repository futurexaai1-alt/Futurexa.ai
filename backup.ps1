# Database Backup Script for Futurexa.ai

$pgBin = 'C:\Program Files\PostgreSQL\17\bin\pg_dump.exe'
$outputFile = "C:\Users\mhdtb\OneDrive\Desktop\Futurexa.ai\futurexa_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').dump"

& $pgBin "postgresql://postgres:iqb8kWnxB2791a0i@db.efootsmlltfdsqfxtwdo.supabase.co:5432/postgres?sslmode=require" -Fc -f $outputFile 2>&1