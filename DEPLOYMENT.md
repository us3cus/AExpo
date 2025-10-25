# Deployment Guide for AExpo

This guide explains how to deploy AExpo to your VPS using the CI/CD pipeline or manual deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Actions CI/CD Setup](#github-actions-cicd-setup)
3. [Manual Deployment](#manual-deployment)
4. [Configuration](#configuration)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### On Your VPS

1. **Docker** (version 20.10 or higher)
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Docker Compose** (version 2.0 or higher)
   ```bash
   # Usually comes with Docker, verify with:
   docker compose version
   ```

3. **Git** (for manual deployment)
   ```bash
   sudo apt-get update
   sudo apt-get install git -y
   ```

### Recommended VPS Specifications

- **CPU**: 2 cores minimum
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB minimum
- **OS**: Ubuntu 20.04 LTS or later (or any Linux with Docker support)

## GitHub Actions CI/CD Setup

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VPS_HOST` | Your VPS IP address or domain | `192.168.1.100` or `example.com` |
| `VPS_USERNAME` | SSH username for VPS | `ubuntu` or `root` |
| `VPS_SSH_KEY` | Private SSH key for authentication | Contents of `~/.ssh/id_rsa` |
| `VPS_SSH_PORT` | SSH port (optional, default: 22) | `22` |
| `VPS_APP_PATH` | Application directory on VPS | `/opt/aexpo` |

### 2. Generate SSH Key Pair

On your local machine or VPS:

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t ed25519 -C "github-actions@aexpo" -f ~/.ssh/aexpo_deploy

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/aexpo_deploy.pub user@your-vps-ip

# Copy private key content for GitHub secret
cat ~/.ssh/aexpo_deploy
```

### 3. Prepare VPS for Deployment

SSH into your VPS and run:

```bash
# Create application directory
sudo mkdir -p /opt/aexpo
sudo chown $USER:$USER /opt/aexpo

# Create docker-compose.yml (will be used by CI/CD)
cd /opt/aexpo
```

### 4. Configure Docker Compose on VPS

Create `/opt/aexpo/docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    image: ghcr.io/us3cus/aexpo:latest
    container_name: aexpo-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - HOST=0.0.0.0
      - PORT=3000
    env_file:
      - .env
    networks:
      - aexpo-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  aexpo-network:
    driver: bridge
```

### 5. Create Environment File

Create `/opt/aexpo/.env`:

```bash
# Node.js Configuration
NODE_ENV=production
HOST=0.0.0.0
PORT=3000

# AWS S3 Configuration (if using)
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_REGION=us-east-1
# S3_BUCKET_NAME=your-bucket-name

# Add other environment variables as needed
```

### 6. Enable GitHub Actions

The CI/CD pipeline will automatically:
- Run on push to `main` or `master` branch
- Lint and test the code
- Build Docker image
- Push to GitHub Container Registry
- Deploy to your VPS

## Manual Deployment

### Option 1: Using the Deployment Script

```bash
# On your VPS
cd /opt/aexpo
wget https://raw.githubusercontent.com/us3cus/AExpo/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Docker Compose

```bash
# Clone the repository
git clone https://github.com/us3cus/AExpo.git /opt/aexpo
cd /opt/aexpo

# Create .env file (see Configuration section)
nano .env

# Build and start
docker compose up -d

# View logs
docker compose logs -f
```

### Option 3: Using Pre-built Image

```bash
# Pull the image from GitHub Container Registry
docker pull ghcr.io/us3cus/aexpo:latest

# Run the container
docker run -d \
  --name aexpo-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  ghcr.io/us3cus/aexpo:latest
```

## Configuration

### Environment Variables

Create a `.env` file in the application directory:

```bash
# Required
NODE_ENV=production
HOST=0.0.0.0
PORT=3000

# AWS S3 (if needed)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# Database (if needed)
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# MONGODB_URI=mongodb://localhost:27017/aexpo
```

### Nginx Reverse Proxy (Optional but Recommended)

For production, use Nginx as a reverse proxy:

```nginx
# /etc/nginx/sites-available/aexpo
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/aexpo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL/TLS with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring and Maintenance

### View Application Logs

```bash
# View all logs
docker compose logs -f

# View last 100 lines
docker compose logs --tail=100

# View specific service
docker compose logs app -f
```

### Restart Application

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart app
```

### Update Application

```bash
# Using deployment script
cd /opt/aexpo
./deploy.sh

# Or manually
cd /opt/aexpo
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Check Application Status

```bash
# Check container status
docker compose ps

# Check resource usage
docker stats aexpo-app

# Test application endpoint
curl http://localhost:3000
```

### Backup

```bash
# Backup configuration
tar -czf aexpo-backup-$(date +%Y%m%d).tar.gz /opt/aexpo/.env /opt/aexpo/docker-compose.yml

# If using volumes for data
docker run --rm -v aexpo_data:/data -v $(pwd):/backup alpine tar -czf /backup/data-backup-$(date +%Y%m%d).tar.gz -C /data .
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs app

# Check if port is already in use
sudo lsof -i :3000

# Remove and recreate containers
docker compose down
docker compose up -d
```

### Image Pull Failed

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull image manually
docker pull ghcr.io/us3cus/aexpo:latest
```

### Application Not Accessible

```bash
# Check if container is running
docker compose ps

# Check firewall
sudo ufw status
sudo ufw allow 3000/tcp

# Check if app is listening
docker exec aexpo-app netstat -tlnp
```

### Out of Disk Space

```bash
# Clean up Docker
docker system prune -af
docker volume prune -f

# Check disk usage
df -h
du -sh /var/lib/docker
```

### Update Failed During CI/CD

1. SSH into VPS
2. Check Docker logs: `docker compose logs`
3. Manually pull and restart: 
   ```bash
   cd /opt/aexpo
   docker compose pull
   docker compose up -d
   ```

## Support

For issues and questions:
- GitHub Issues: https://github.com/us3cus/AExpo/issues
- Check logs: `docker compose logs -f`
- Application health: `docker compose ps`

## Security Recommendations

1. **Use SSH keys** instead of passwords
2. **Configure firewall** (UFW or iptables)
3. **Keep Docker updated**: `sudo apt-get update && sudo apt-get upgrade`
4. **Use secrets management** for sensitive data
5. **Enable automatic security updates**
6. **Use HTTPS** with Let's Encrypt
7. **Regularly backup** your configuration and data
8. **Monitor logs** for suspicious activity
