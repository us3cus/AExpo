# AExpo CI/CD Quick Reference

## 📋 Overview

This project includes a complete CI/CD pipeline for deploying AExpo to your VPS.

## 🚀 Quick Start

### First-Time VPS Setup

1. **SSH into your VPS**
   ```bash
   ssh user@your-vps-ip
   ```

2. **Run setup script**
   ```bash
   # Download the script
   wget https://raw.githubusercontent.com/us3cus/AExpo/main/setup-vps.sh
   
   # Review it (recommended)
   cat setup-vps.sh
   
   # Make executable and run
   chmod +x setup-vps.sh
   ./setup-vps.sh
   ```

3. **Configure environment**
   ```bash
   cd /opt/aexpo
   nano .env  # Add your configuration
   ```

4. **Deploy**
   ```bash
   ./deploy.sh
   ```

### GitHub Actions Setup

1. **Add GitHub Secrets** (Settings → Secrets → Actions):
   - `VPS_HOST` - Your VPS IP or domain
   - `VPS_USERNAME` - SSH username
   - `VPS_SSH_KEY` - Private SSH key
   - `VPS_APP_PATH` - `/opt/aexpo`

2. **Prepare VPS**
   ```bash
   # On VPS, create docker-compose.yml
   mkdir -p /opt/aexpo
   cd /opt/aexpo
   
   # Create docker-compose.yml with image: ghcr.io/us3cus/aexpo:latest
   ```

3. **Push to main branch** - Automatic deployment!

## 📁 Files Structure

```
.
├── .github/workflows/ci-cd.yml  # GitHub Actions workflow
├── Dockerfile                    # Docker image configuration
├── docker-compose.yml            # Docker Compose setup
├── deploy.sh                     # Manual deployment script
├── setup-vps.sh                  # VPS initial setup
├── nginx.conf.example            # Nginx reverse proxy config
├── .env.example                  # Environment template
└── DEPLOYMENT.md                 # Full documentation
```

## 🔧 Common Commands

### On VPS

```bash
# View logs
docker compose logs -f

# Restart application
docker compose restart

# Stop application
docker compose down

# Update and redeploy
cd /opt/aexpo && ./deploy.sh

# Check status
docker compose ps
```

### Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build

# Test Docker build
docker compose build
docker compose up
```

## 🔐 Environment Variables

Required variables in `.env`:

```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
```

Optional (add as needed):
- AWS S3 credentials
- Database URLs
- API keys

## 📊 CI/CD Pipeline Flow

1. **Trigger**: Push to main/master
2. **Lint & Test**: Run linter and build
3. **Build**: Create Docker image
4. **Push**: Upload to GitHub Container Registry
5. **Deploy**: SSH to VPS and deploy

## 🆘 Troubleshooting

### Container won't start
```bash
docker compose logs app
```

### Port already in use
```bash
sudo lsof -i :3000
```

### Permission denied
```bash
sudo chown -R $USER:$USER /opt/aexpo
```

### Out of space
```bash
docker system prune -af
```

## 📚 Documentation

- Full guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- API docs: [API.md](API.md)
- Issues: https://github.com/us3cus/AExpo/issues

## 🔄 Update Workflow

### Automatic (via GitHub Actions)
Just push to main branch!

### Manual
```bash
cd /opt/aexpo
./deploy.sh
```

## 🌐 Production Setup

1. **Install Nginx**
   ```bash
   sudo apt install nginx
   sudo cp nginx.conf.example /etc/nginx/sites-available/aexpo
   sudo ln -s /etc/nginx/sites-available/aexpo /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

2. **Get SSL Certificate**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

3. **Configure Firewall**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

## ✅ Success Indicators

- [ ] Docker containers running: `docker compose ps`
- [ ] Application accessible: `curl http://localhost:3000`
- [ ] Logs show no errors: `docker compose logs`
- [ ] GitHub Actions passing: Check repo Actions tab

## 🎯 Next Steps

After deployment:
1. Configure your domain DNS
2. Set up SSL with Let's Encrypt
3. Configure Nginx reverse proxy
4. Set up monitoring (optional)
5. Configure backups (optional)
