# AutoDockr Docker Deployment Guide

## Prerequisites

Before running AutoDockr with Docker, ensure you have:

1. **Docker installed** (version 20.10 or higher)
2. **Docker Compose installed** (version 2.0 or higher)
3. **Git** (to clone the repository)
4. **Sufficient disk space** (at least 2GB free)

## Quick Start (Recommended)

### Option 1: Production Deployment with Docker Compose

```bash
# 1. Clone or navigate to your project directory
cd /path/to/autodockr

# 2. Build and start the application
docker-compose up -d

# 3. Access the application
open http://localhost

# 4. Check container status
docker-compose ps

# 5. View logs (if needed)
docker-compose logs -f
```

### Option 2: Development Environment

```bash
# 1. Start development environment
docker-compose -f docker-compose.dev.yml up -d

# 2. Access development server with hot reload
open http://localhost:3000

# 3. View development logs
docker-compose -f docker-compose.dev.yml logs -f autodockr-dev
```

## Step-by-Step Production Deployment

### Step 1: Verify Docker Installation

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Test Docker installation
docker run hello-world
```

### Step 2: Prepare the Environment

```bash
# Create project directory (if needed)
mkdir -p ~/autodockr
cd ~/autodockr

# Ensure all required files are present
ls -la
# Should see: Dockerfile, docker-compose.yml, nginx.conf, package.json, src/, etc.
```

### Step 3: Build the Application

```bash
# Build the Docker image
docker build -t autodockr:latest .

# Verify the image was created
docker images | grep autodockr
```

### Step 4: Run with Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Check if containers are running
docker-compose ps

# Expected output:
# NAME        IMAGE     COMMAND                  SERVICE     STATUS      PORTS
# autodockr   autodockr "nginx -g 'daemon of…"   autodockr   Up          0.0.0.0:80->80/tcp
# traefik     traefik   "/entrypoint.sh --ap…"   traefik     Up          0.0.0.0:8000->80/tcp, 0.0.0.0:8080->8080/tcp
```

### Step 5: Verify Deployment

```bash
# Check application health
curl -f http://localhost/health

# Check application response
curl -I http://localhost

# View application logs
docker-compose logs autodockr

# Check resource usage
docker stats autodockr
```

## Alternative Deployment Methods

### Method 1: Single Container (Without Traefik)

```bash
# Build the image
docker build -t autodockr .

# Run the container
docker run -d \
  --name autodockr \
  -p 80:80 \
  --restart unless-stopped \
  autodockr

# Check container status
docker ps | grep autodockr

# View logs
docker logs autodockr
```

### Method 2: Custom Port Mapping

```bash
# Run on custom port (e.g., 8080)
docker run -d \
  --name autodockr \
  -p 8080:80 \
  --restart unless-stopped \
  autodockr

# Access application
open http://localhost:8080
```

### Method 3: Development with Volume Mounting

```bash
# Run development container with live reload
docker run -d \
  --name autodockr-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NODE_ENV=development \
  -e CHOKIDAR_USEPOLLING=true \
  autodockr:dev

# Build development image first
docker build -f Dockerfile.dev -t autodockr:dev .
```

## Troubleshooting Common Issues

### Issue 1: Port Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80

# Kill the process (replace PID)
sudo kill -9 <PID>

# Or use a different port
docker run -d --name autodockr -p 8080:80 autodockr
```

### Issue 2: Permission Denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, or run:
newgrp docker

# Test Docker without sudo
docker ps
```

### Issue 3: Build Failures

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t autodockr .

# Check Docker daemon status
sudo systemctl status docker
```

### Issue 4: Container Won't Start

```bash
# Check container logs
docker logs autodockr

# Inspect container configuration
docker inspect autodockr

# Check if image exists
docker images | grep autodockr

# Remove and recreate container
docker rm -f autodockr
docker run -d --name autodockr -p 80:80 autodockr
```

### Issue 5: Application Not Accessible

```bash
# Check if container is running
docker ps

# Check port mapping
docker port autodockr

# Test internal connectivity
docker exec autodockr curl -f http://localhost/health

# Check firewall settings (if applicable)
sudo ufw status
```

## Health Checks and Monitoring

### Built-in Health Check

```bash
# Check container health status
docker inspect autodockr | grep -A 10 "Health"

# Manual health check
curl -f http://localhost/health
```

### Monitoring Commands

```bash
# Real-time container stats
docker stats autodockr

# Container resource usage
docker exec autodockr top

# Nginx access logs
docker exec autodockr tail -f /var/log/nginx/access.log

# Nginx error logs
docker exec autodockr tail -f /var/log/nginx/error.log
```

## Maintenance Commands

### Update Application

```bash
# Pull latest changes (if using git)
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup and Restore

```bash
# Save container as image
docker commit autodockr autodockr:backup-$(date +%Y%m%d)

# Export container
docker export autodockr > autodockr-backup.tar

# Save image to file
docker save autodockr:latest | gzip > autodockr-image.tar.gz

# Load image from file
docker load < autodockr-image.tar.gz
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi autodockr:latest

# Clean up unused resources
docker system prune -a

# Remove volumes (if any)
docker volume prune
```

## Performance Optimization

### Resource Limits

```bash
# Run with resource limits
docker run -d \
  --name autodockr \
  --memory="512m" \
  --cpus="1.0" \
  -p 80:80 \
  autodockr
```

### Production Optimizations

```yaml
# Add to docker-compose.yml
services:
  autodockr:
    # ... existing configuration
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
        reservations:
          memory: 256M
          cpus: '0.5'
```

## Security Considerations

### Run as Non-Root User

```dockerfile
# Add to Dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

### Network Security

```bash
# Create custom network
docker network create autodockr-network

# Run container in custom network
docker run -d \
  --name autodockr \
  --network autodockr-network \
  -p 80:80 \
  autodockr
```

## Environment-Specific Configurations

### Development

```bash
# Use development compose file
docker-compose -f docker-compose.dev.yml up -d

# Enable debug mode
docker run -d \
  --name autodockr-dev \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -e DEBUG=true \
  autodockr:dev
```

### Production

```bash
# Use production settings
docker run -d \
  --name autodockr \
  -p 80:80 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  autodockr
```

### Staging

```bash
# Staging environment
docker run -d \
  --name autodockr-staging \
  -p 8080:80 \
  -e NODE_ENV=staging \
  autodockr
```

## Verification Checklist

After deployment, verify:

- [ ] Container is running: `docker ps | grep autodockr`
- [ ] Application is accessible: `curl -f http://localhost`
- [ ] Health check passes: `curl -f http://localhost/health`
- [ ] No errors in logs: `docker logs autodockr`
- [ ] All features work: Test each tab in the UI
- [ ] Performance is acceptable: `docker stats autodockr`

## Support and Troubleshooting

If you encounter issues:

1. **Check the logs**: `docker logs autodockr`
2. **Verify Docker installation**: `docker --version`
3. **Check system resources**: `df -h` and `free -m`
4. **Review firewall settings**: `sudo ufw status`
5. **Test with minimal configuration**: Use single container method
6. **Check for port conflicts**: `sudo lsof -i :80`

For additional help, refer to:
- Docker documentation: https://docs.docker.com/
- AutoDockr GitHub issues (if available)
- Docker community forums

## Quick Commands Reference

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Update application
docker-compose pull && docker-compose up -d

# Check status
docker-compose ps

# Access container shell
docker exec -it autodockr sh

# Check application health
curl -f http://localhost/health
```