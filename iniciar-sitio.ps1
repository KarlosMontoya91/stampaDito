<#
.SYNOPSIS
    Servidor HTTP local ligero para StampaDito (sin dependencias externas).
.DESCRIPTION
    Inicia un servidor web en http://localhost:8080 utilizando System.Net.Sockets.TcpListener
    incluido nativamente en Windows PowerShell.
#>

param(
    [int]$Port = 8080
)

$Root = $PSScriptRoot
if (-not $Root) { $Root = (Get-Location).Path }

$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
}

$Listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$Listener.Start()

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " StampaDito servido en: http://localhost:$Port/" -ForegroundColor Green
Write-Host " Presiona Ctrl+C para detener el servidor." -ForegroundColor Yellow
Write-Host "=========================================================="

try {
    while ($true) {
        if (-not $Listener.Pending()) {
            Start-Sleep -Milliseconds 15
            continue
        }
        $Client = $Listener.AcceptTcpClient()
        $Client.ReceiveTimeout = 2000
        $Stream = $Client.GetStream()

        $Buffer = New-Object byte[] 16384
        $ReadCount = 0
        try {
            if ($Stream.DataAvailable -or $Client.Connected) {
                $ReadCount = $Stream.Read($Buffer, 0, $Buffer.Length)
            }
        } catch {
            $ReadCount = 0
        }

        if ($ReadCount -gt 0) {
            $RawRequest = [System.Text.Encoding]::ASCII.GetString($Buffer, 0, $ReadCount)
            $FirstLine = ($RawRequest -split "`r`n")[0]
            $Parts = $FirstLine.Split(" ")
            if ($Parts.Length -ge 2) {
                $RawUrl = [System.Uri]::UnescapeDataString($Parts[1].Split("?")[0])
                if ($RawUrl -eq "/") { $RawUrl = "/index.html" }
                $RelPath = $RawUrl.TrimStart("/").Replace("/", "\")
                $FilePath = Join-Path $Root $RelPath

                if ((Test-Path $FilePath -PathType Leaf)) {
                    $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
                    $ContentType = if ($MimeTypes.ContainsKey($Ext)) { $MimeTypes[$Ext] } else { "application/octet-stream" }
                    $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
                    $Header = "HTTP/1.1 200 OK`r`nContent-Type: $ContentType`r`nContent-Length: $($Bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
                    $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($Header)
                    $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
                    $Stream.Write($Bytes, 0, $Bytes.Length)
                } else {
                    $NotFound = [System.Text.Encoding]::UTF8.GetBytes("404 No encontrado")
                    $Header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($NotFound.Length)`r`nConnection: close`r`n`r`n"
                    $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($Header)
                    $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
                    $Stream.Write($NotFound, 0, $NotFound.Length)
                }
            }
        }
        $Stream.Close()
        $Client.Close()
    }
} finally {
    $Listener.Stop()
}
