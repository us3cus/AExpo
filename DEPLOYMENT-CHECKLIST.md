# VPS Deployment Checklist

Use this checklist to ensure your VPS deployment is properly configured.

## Before Deployment

### 1. VPS Prerequisites
- [ ] VPS is accessible via SSH
- [ ] VPS has Ubuntu 20.04 LTS or later (or compatible Linux distribution)
- [ ] VPS has at least 2GB RAM (4GB recommended)
- [ ] VPS has at least 20GB storage
- [ ] You have sudo/root access on the VPS
- [ ] Firewall allows SSH access (port 22)

### 2. Domain Configuration (Optional)
- [ ] Domain/subdomain points to VPS IP address
- [ ] DNS propagation is complete (use `nslookup your-domain.com`)
- [ ] Port 80 and 443 are accessible (for HTTP/HTTPS)

### 3. GitHub Repository
- [ ] Repository is accessible
- [ ] You have admin access to the repository
- [ ] GitHub Actions are enabled for the repository

## VPS Setup Steps

### 1. Initial Server Setup
```bash
# Connect to VPS
ssh user@your-vps-ip

# Run the setup script
curl -fsSL https://raw.githubusercontent.com/us3cus/AExpo/main/setup-vps.sh | bash

# OR manually install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```
- [ ] Docker is installed and running
- [ ] Docker Compose is installed
- [ ] User is added to docker group
- [ ] Git is installed
- [ ] Firewall is configured

### 2. Application Setup
```bash
# Create app directory
sudo mkdir -p /opt/aexpo
sudo chown $USER:$USER /opt/aexpo

# Clone repository
cd /opt/aexpo
git clone https://github.com/us3cus/AExpo.git .

# Create environment file
cp .env.example .env
nano .env  # Configure your environment variables
```
- [ ] Application directory created
- [ ] Repository cloned
- [ ] `.env` file configured with correct values
- [ ] All required environment variables are set

### 3. Manual Deployment Test
```bash
cd /opt/aexpo
./deploy.sh
```
- [ ] Deployment script runs without errors
- [ ] Docker containers are created
- [ ] Application is accessible at `http://localhost:3000`
- [ ] Health check passes: `curl http://localhost:3000`

## GitHub Actions Setup

### 1. Generate SSH Key
```bash
# On your local machine or VPS
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# Add public key to VPS
ssh-copy-id -i ~/.ssh/github_actions.pub user@vps-ip

# Test connection
ssh -i ~/.ssh/github_actions user@vps-ip
```
- [ ] SSH key pair generated
- [ ] Public key added to VPS `~/.ssh/authorized_keys`
- [ ] SSH connection works with the new key

### 2. Configure GitHub Secrets
Go to: `https://github.com/us3cus/AExpo/settings/secrets/actions`

Add these secrets:
- [ ] `VPS_HOST`: Your VPS IP address or domain
- [ ] `VPS_USERNAME`: SSH username (e.g., ubuntu, root)
- [ ] `VPS_SSH_KEY`: Private key content (from `~/.ssh/github_actions`)
- [ ] `VPS_SSH_PORT`: SSH port (default: 22)
- [ ] `VPS_APP_PATH`: Application path (default: `/opt/aexpo`)

### 3. Prepare VPS for CI/CD
```bash
# On VPS, ensure docker-compose.yml uses the registry image
cd /opt/aexpo

# Edit docker-compose.yml to use the GitHub Container Registry image
nano docker-compose.yml
```

Update the `image` line in docker-compose.yml:
```yaml
services:
  app:
    image: ghcr.io/us3cus/aexpo:latest
    # ... rest of config
```
- [ ] `docker-compose.yml` updated to use registry image
- [ ] VPS can access GitHub Container Registry

### 4. Test GitHub Actions
```bash
# Make a small change and push to trigger workflow
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```
- [ ] GitHub Actions workflow triggers on push
- [ ] Lint and test job passes
- [ ] Docker image builds successfully
- [ ] Image pushes to GitHub Container Registry
- [ ] Deployment to VPS succeeds
- [ ] Application updates on VPS

## Production Configuration (Optional but Recommended)

### 1. Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx

# Copy configuration
sudo cp nginx.conf.example /etc/nginx/sites-available/aexpo

# Edit configuration with your domain
sudo nano /etc/nginx/sites-available/aexpo

# Enable site
sudo ln -s /etc/nginx/sites-available/aexpo /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```
- [ ] Nginx is installed
- [ ] Configuration file is customized
- [ ] Site is enabled
- [ ] Nginx configuration is valid
- [ ] Application accessible via domain

### 2. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```
- [ ] Certbot is installed
- [ ] SSL certificate obtained
- [ ] HTTPS is working
- [ ] Auto-renewal is configured

### 3. Firewall Configuration
```bash
# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```
- [ ] UFW is enabled
- [ ] SSH port is allowed
- [ ] HTTP (80) is allowed
- [ ] HTTPS (443) is allowed
- [ ] Firewall status verified: `sudo ufw status`

### 4. Monitoring Setup (Optional)
- [ ] Log rotation configured
- [ ] Disk usage monitoring set up
- [ ] Uptime monitoring configured
- [ ] Error tracking integrated (e.g., Sentry)
- [ ] Performance monitoring added

## Post-Deployment Verification

### 1. Application Health
- [ ] Application is running: `docker compose ps`
- [ ] No errors in logs: `docker compose logs`
- [ ] Health check passes
- [ ] All features work correctly

### 2. CI/CD Pipeline
- [ ] Workflow completes successfully
- [ ] Automatic deployment works on push to main
- [ ] Container registry shows latest images
- [ ] Deployment logs are clean

### 3. Security
- [ ] SSH key authentication is working
- [ ] Password authentication is disabled (recommended)
- [ ] Firewall is properly configured
- [ ] SSL/TLS is working (if configured)
- [ ] Environment variables are not exposed
- [ ] Docker images are from trusted sources

### 4. Performance
- [ ] Application responds quickly
- [ ] Resource usage is acceptable: `docker stats`
- [ ] No memory leaks
- [ ] Disk space is sufficient: `df -h`

## Maintenance

### Regular Tasks
- [ ] Monitor application logs weekly
- [ ] Check disk space monthly
- [ ] Update Docker images regularly
- [ ] Review security advisories
- [ ] Test backup restoration quarterly

### Emergency Procedures
- [ ] Rollback procedure documented
- [ ] Backup restoration tested
- [ ] Emergency contacts listed
- [ ] Incident response plan ready

## Troubleshooting Resources

If you encounter issues:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
2. Review [QUICK-START.md](QUICK-START.md) for common commands
3. See [HEALTHCHECK.md](HEALTHCHECK.md) for health monitoring
4. GitHub Issues: https://github.com/us3cus/AExpo/issues

## Success Criteria

Your deployment is successful when:
- ✅ Application is accessible via domain (or IP)
- ✅ SSL/HTTPS is working (if configured)
- ✅ GitHub Actions automatically deploy on push
- ✅ No errors in application logs
- ✅ Health checks are passing
- ✅ All features work as expected

---

**Congratulations!** If all items are checked, your VPS deployment is complete! 🎉
