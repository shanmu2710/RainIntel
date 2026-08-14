# ============================================================
# RAININTEL - PLATFORM LAUNCHER FOR WINDOWS (POWERSHELL)
# ============================================================

Clear-Host
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "           RAININTEL PLATFORM LAUNCHER" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Prompt for database credentials
$OraclePassword = Read-Host "Enter password for Oracle user RAININTEL"
if (-not $OraclePassword) {
    Write-Host "Oracle database password is required to connect to XE." -ForegroundColor Red
    exit 1
}

# 2. Configure Environment variables
$env:ORACLE_USERNAME = "RAININTEL"
$env:ORACLE_PASSWORD = $OraclePassword
$env:ORACLE_SERVICE = "xe"
$env:JWT_SECRET = "RainIntelSecretKey2026SecureStringForAuthenticationTokens"

# Helper function to run service in separate PowerShell window
function Start-ServiceWindow {
    param(
        [string]$ServiceName,
        [string]$Directory,
        [string]$Command
    )
    Write-Host "Launching $ServiceName..." -ForegroundColor Yellow
    $argumentList = "-NoExit", "-Command", "`$env:ORACLE_USERNAME='$env:ORACLE_USERNAME'; `$env:ORACLE_PASSWORD='$env:ORACLE_PASSWORD'; `$env:ORACLE_SERVICE='$env:ORACLE_SERVICE'; `$env:JWT_SECRET='$env:JWT_SECRET'; cd $Directory; $Command"
    Start-Process powershell -ArgumentList $argumentList -WindowStyle Normal
}


# [1/6] Launch Service Registry
Start-ServiceWindow "Eureka Service Registry (Port 8761)" "backend/service-registry" "mvn spring-boot:run"
Write-Host "Waiting 8 seconds for registry initialization..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# [2/6] Launch Config Server
Start-ServiceWindow "Config Server (Port 8888)" "backend/config-server" "mvn spring-boot:run"
Write-Host "Waiting 8 seconds for native properties loading..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# [3/6] Launch API Gateway
Start-ServiceWindow "API Gateway (Port 8080)" "backend/api-gateway" "mvn spring-boot:run"

# [4/6] Launch Auth Service
Start-ServiceWindow "Auth Service (Port 8081)" "backend/auth-service" "mvn spring-boot:run"

# [5/6] Launch Business Service
Start-ServiceWindow "Business Service (Port 8082)" "backend/business-service" "mvn spring-boot:run"
Write-Host "Waiting 8 seconds for discovery registrations..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# [6/6] Launch React Frontend
Write-Host "Launching Vite React Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " RainIntel platform successfully initialized." -ForegroundColor Green
Write-Host " - Frontend Portal: http://localhost:5173" -ForegroundColor Green
Write-Host " - API Gateway    : http://localhost:8080" -ForegroundColor Green

Write-Host " - Discovery Dashboard: http://localhost:8761" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

