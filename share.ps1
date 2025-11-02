# Quick Share Script - Three-Body Simulator
# Choose your sharing method!

Write-Host "🌌 Three-Body Problem Simulator - Sharing Assistant" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "How do you want to share your simulator?" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 🚀 Deploy to Cloud (Railway/Netlify) - EASIEST!" -ForegroundColor Green
Write-Host "2. 🐳 Push to Docker Hub - For Docker users" -ForegroundColor Cyan
Write-Host "3. 📦 Create ZIP file - Send via email/USB" -ForegroundColor Blue
Write-Host "4. 🌐 Start local server - Show on your network" -ForegroundColor Magenta
Write-Host "5. 💾 Export Docker image - Share as file" -ForegroundColor White
Write-Host "6. 📋 Show me all options - View full guide" -ForegroundColor Yellow
Write-Host ""

$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Cloud Deployment Options:" -ForegroundColor Green
        Write-Host ""
        Write-Host "Option A: Netlify (Easiest - Drag & Drop)" -ForegroundColor Cyan
        Write-Host "  1. Go to: https://netlify.com" -ForegroundColor White
        Write-Host "  2. Sign up (free)" -ForegroundColor White
        Write-Host "  3. Click 'Add new site' → 'Deploy manually'" -ForegroundColor White
        Write-Host "  4. Drag your folder or these files:" -ForegroundColor White
        Write-Host "     - index.html, styles.css, script.js" -ForegroundColor Gray
        Write-Host "  5. Get your URL: https://your-name.netlify.app" -ForegroundColor Green
        Write-Host ""
        Write-Host "Option B: Railway (Best for Docker)" -ForegroundColor Cyan
        Write-Host "  1. Go to: https://railway.app" -ForegroundColor White
        Write-Host "  2. Sign up with GitHub (free)" -ForegroundColor White
        Write-Host "  3. Push your code to GitHub first" -ForegroundColor White
        Write-Host "  4. Connect Railway to your repo" -ForegroundColor White
        Write-Host "  5. Railway auto-deploys from Dockerfile" -ForegroundColor White
        Write-Host "  6. Get your URL: https://your-app.railway.app" -ForegroundColor Green
        Write-Host ""
        
        $openBrowser = Read-Host "Open Netlify in browser now? (y/n)"
        if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
            Start-Process "https://netlify.com"
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🐳 Pushing to Docker Hub..." -ForegroundColor Cyan
        Write-Host ""
        
        $username = Read-Host "Enter your Docker Hub username"
        
        if (-not $username) {
            Write-Host "❌ Username required!" -ForegroundColor Red
            exit
        }
        
        Write-Host ""
        Write-Host "Building Docker image..." -ForegroundColor Yellow
        docker build -t "$username/three-body-simulator:latest" .
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Image built successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Logging in to Docker Hub..." -ForegroundColor Yellow
            docker login
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "Pushing image to Docker Hub..." -ForegroundColor Yellow
                docker push "$username/three-body-simulator:latest"
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host ""
                    Write-Host "✓ Successfully pushed to Docker Hub!" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "📋 Share this command with your friends:" -ForegroundColor Yellow
                    Write-Host ""
                    Write-Host "  docker run -d -p 8080:80 $username/three-body-simulator:latest" -ForegroundColor Cyan
                    Write-Host ""
                    Write-Host "Then they visit: http://localhost:8080" -ForegroundColor Green
                } else {
                    Write-Host "❌ Failed to push image" -ForegroundColor Red
                }
            } else {
                Write-Host "❌ Docker Hub login failed" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Failed to build image" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "📦 Creating ZIP file..." -ForegroundColor Cyan
        
        $zipPath = Join-Path $PSScriptRoot "three-body-simulator.zip"
        
        if (Test-Path $zipPath) {
            Remove-Item $zipPath
        }
        
        # Create list of files to include
        $filesToZip = @(
            "index.html",
            "styles.css", 
            "script.js",
            "README.md",
            "SOLUTIONS_GUIDE.md",
            "CUSTOM_EDITOR_GUIDE.md"
        )
        
        Compress-Archive -Path $filesToZip -DestinationPath $zipPath
        
        if (Test-Path $zipPath) {
            Write-Host "✓ ZIP file created successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Location: $zipPath" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "📧 You can now:" -ForegroundColor Cyan
            Write-Host "  - Email the ZIP file to friends" -ForegroundColor White
            Write-Host "  - Share via Google Drive/Dropbox" -ForegroundColor White
            Write-Host "  - Copy to USB drive" -ForegroundColor White
            Write-Host ""
            Write-Host "📋 Instructions for friends:" -ForegroundColor Cyan
            Write-Host "  1. Extract the ZIP file" -ForegroundColor White
            Write-Host "  2. Open index.html in any web browser" -ForegroundColor White
            Write-Host "  3. Enjoy the simulator!" -ForegroundColor White
            Write-Host ""
            
            $openFolder = Read-Host "Open folder to see ZIP file? (y/n)"
            if ($openFolder -eq "y" -or $openFolder -eq "Y") {
                explorer.exe /select,$zipPath
            }
        } else {
            Write-Host "❌ Failed to create ZIP file" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host ""
        Write-Host "🌐 Starting local web server..." -ForegroundColor Cyan
        Write-Host ""
        
        # Get local IP
        $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress
        
        Write-Host "Your local IP address: $ip" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📱 Share this URL with friends on the same WiFi:" -ForegroundColor Green
        Write-Host "   http://${ip}:8080" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        
        # Try Python first
        $pythonExists = Get-Command python -ErrorAction SilentlyContinue
        if ($pythonExists) {
            python -m http.server 8080
        } else {
            Write-Host "Python not found. Using Docker instead..." -ForegroundColor Yellow
            docker-compose up
        }
    }
    
    "5" {
        Write-Host ""
        Write-Host "💾 Exporting Docker image to file..." -ForegroundColor Cyan
        
        $exportPath = Join-Path $PSScriptRoot "three-body-simulator.tar"
        
        Write-Host ""
        Write-Host "This may take a few minutes..." -ForegroundColor Yellow
        docker save three-body-simulator:latest -o $exportPath
        
        if ($LASTEXITCODE -eq 0 -and (Test-Path $exportPath)) {
            $fileSize = [math]::Round((Get-Item $exportPath).Length / 1MB, 2)
            Write-Host ""
            Write-Host "✓ Docker image exported successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Location: $exportPath" -ForegroundColor Yellow
            Write-Host "Size: $fileSize MB" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "📋 Instructions for friends:" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "  They need to run these commands:" -ForegroundColor White
            Write-Host "  1. docker load -i three-body-simulator.tar" -ForegroundColor Gray
            Write-Host "  2. docker run -d -p 8080:80 three-body-simulator:latest" -ForegroundColor Gray
            Write-Host "  3. Open http://localhost:8080" -ForegroundColor Gray
            Write-Host ""
            
            $openFolder = Read-Host "Open folder to see file? (y/n)"
            if ($openFolder -eq "y" -or $openFolder -eq "Y") {
                explorer.exe /select,$exportPath
            }
        } else {
            Write-Host "❌ Failed to export image" -ForegroundColor Red
            Write-Host "Make sure the Docker image exists:" -ForegroundColor Yellow
            Write-Host "  docker images | findstr three-body" -ForegroundColor Gray
        }
    }
    
    "6" {
        Write-Host ""
        Write-Host "📋 Opening full sharing guide..." -ForegroundColor Cyan
        Start-Process "SHARING_GUIDE.md"
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        Write-Host "Please run the script again and choose 1-6" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
Write-Host ""
