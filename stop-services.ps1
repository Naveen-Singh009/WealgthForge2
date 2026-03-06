param(
    [int[]]$Ports = @(8082, 8083, 8084, 8085, 8087, 8088, 8761, 8888, 9090)
)

$pids = @()
foreach ($port in $Ports) {
    $listeners = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
    if ($listeners) {
        $pids += ($listeners | Select-Object -ExpandProperty OwningProcess)
    }
}

$pids = $pids | Sort-Object -Unique
foreach ($pidValue in $pids) {
    $proc = Get-Process -Id $pidValue -ErrorAction SilentlyContinue
    if ($proc -and ($proc.ProcessName -like 'java*')) {
        Stop-Process -Id $pidValue -Force
        Write-Output "Stopped PID $pidValue ($($proc.ProcessName))"
    } elseif ($proc) {
        Write-Output "Skipped PID $pidValue ($($proc.ProcessName))"
    }
}
