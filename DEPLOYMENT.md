# 🚀 Quick Deployment Guide

## Three-Body Problem Simulator - Docker Deployment

### For Users Without Technical Background

#### Step 1: Install Docker
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Wait for Docker to fully start (you'll see a whale icon in your system tray)

#### Step 2: Deploy the Simulator

**Windows Users:**
1. Open PowerShell in this folder (Right-click → "Open PowerShell here")
2. Run: `.\deploy.ps1`
3. Choose option 1 (Build and run with Docker Compose)
4. Wait for the build to complete
5. Open your browser to: http://localhost:8080

**Mac/Linux Users:**
1. Open Terminal in this folder
2. Run: `docker-compose up -d --build`
3. Open your browser to: http://localhost:8080

#### Step 3: Share with Others

**Option A: Docker Hub (Public)**
```bash
# Tag your image
docker tag three-body-simulator yourusername/three-body-simulator:latest

# Login to Docker Hub
docker login

# Push the image
docker push yourusername/three-body-simulator:latest
```

Now others can run:
```bash
docker run -d -p 8080:80 yourusername/three-body-simulator:latest
```

**Option B: Export/Import (Offline)**
```bash
# Export the image to a file
docker save three-body-simulator:latest -o three-body-simulator.tar

# Send the .tar file to others

# They can load it with:
docker load -i three-body-simulator.tar
docker run -d -p 8080:80 three-body-simulator:latest
```

**Option C: Cloud Hosting**
Deploy to free/paid cloud services:
- **Heroku** (with container registry)
- **Railway.app** (Free tier available)
- **Fly.io** (Free tier available)
- **AWS** (EC2, ECS, or Fargate)
- **Google Cloud Run** (Free tier available)
- **Azure Container Instances**

### Useful Commands

```bash
# Check if container is running
docker ps

# View logs
docker-compose logs -f

# Stop the simulator
docker-compose down

# Restart the simulator
docker-compose restart

# Update and rebuild
docker-compose up -d --build
```

### Troubleshooting

**Problem: "docker: command not found"**
- Docker is not installed or not in PATH
- Install Docker Desktop and restart your terminal

**Problem: "Cannot connect to Docker daemon"**
- Docker Desktop is not running
- Start Docker Desktop and wait for it to fully initialize

**Problem: "Port 8080 is already in use"**
- Change the port in docker-compose.yml:
  ```yaml
  ports:
    - "3000:80"  # Use port 3000 instead
  ```

**Problem: Container won't start**
- Check logs: `docker-compose logs`
- Try rebuilding: `docker-compose down && docker-compose up -d --build`

### System Requirements

- **RAM**: 128MB minimum (256MB recommended)
- **CPU**: Any modern CPU (0.25 cores minimum)
- **Disk**: ~50MB for the container
- **OS**: Windows 10+, macOS 10.14+, or modern Linux

### Security Notes

- The simulator runs on HTTP (not HTTPS) by default
- For production, use a reverse proxy with SSL (nginx, Traefik, Caddy)
- The container runs as a non-root user for security
- No sensitive data is stored or transmitted

### Performance Tips

1. **Increase resources** in Docker Desktop settings if needed
2. **Use HTTP/2** with a reverse proxy for better performance
3. **Enable caching** with a CDN for public deployments
4. **Monitor** resource usage: `docker stats three-body-simulator`

---

**Need Help?** Open an issue on GitHub or consult the main README.md
