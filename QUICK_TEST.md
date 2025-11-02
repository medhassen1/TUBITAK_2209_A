# Quick Test Commands

## Build and Test Locally

# Build the Docker image
docker build -t three-body-simulator:latest .

# Run the container
docker run -d -p 8080:80 --name three-body-test three-body-simulator:latest

# Check if it's running
docker ps | findstr three-body

# Test the endpoint
curl http://localhost:8080

# View logs
docker logs three-body-test

# Stop and remove
docker stop three-body-test
docker rm three-body-test

## Or use Docker Compose (Recommended)

# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

## Verify the build size

# Check image size
docker images | findstr three-body

## Push to Docker Hub (Optional)

# Login
docker login

# Tag with your username
docker tag three-body-simulator:latest YOUR_USERNAME/three-body-simulator:latest

# Push
docker push YOUR_USERNAME/three-body-simulator:latest

# Others can now pull and run:
docker run -d -p 8080:80 YOUR_USERNAME/three-body-simulator:latest
