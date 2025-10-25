#!/bin/bash

# VPS Setup Script for AExpo
# This script prepares a fresh VPS for hosting AExpo

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "================================================"
echo "  AExpo VPS Setup Script"
echo "================================================"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_warning "Please do not run as root. Use a regular user with sudo privileges."
    exit 1
fi

# Update system
print_message "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
if ! command -v docker &> /dev/null; then
    print_message "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_message "Docker installed successfully!"
else
    print_message "Docker is already installed."
fi

# Install Docker Compose (if not already installed)
if ! command -v docker compose &> /dev/null; then
    print_message "Installing Docker Compose..."
    sudo apt-get install docker-compose-plugin -y
    print_message "Docker Compose installed successfully!"
else
    print_message "Docker Compose is already installed."
fi

# Install Git
if ! command -v git &> /dev/null; then
    print_message "Installing Git..."
    sudo apt-get install git -y
else
    print_message "Git is already installed."
fi

# Install other useful tools
print_message "Installing useful tools..."
sudo apt-get install -y curl wget htop net-tools ufw

# Configure firewall
print_message "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
print_message "Firewall configured!"

# Create application directory
APP_DIR="/opt/aexpo"
print_message "Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Install Nginx (optional)
read -p "Do you want to install Nginx as reverse proxy? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_message "Installing Nginx..."
    sudo apt-get install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
    print_message "Nginx installed and started!"
fi

# Install Certbot for SSL (optional)
read -p "Do you want to install Certbot for SSL certificates? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_message "Installing Certbot..."
    sudo apt-get install certbot python3-certbot-nginx -y
    print_message "Certbot installed!"
    print_warning "Run 'sudo certbot --nginx -d your-domain.com' to obtain SSL certificate"
fi

# Clone repository or download deployment script
read -p "Do you want to clone the AExpo repository now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd $APP_DIR
    print_message "Cloning repository..."
    git clone https://github.com/us3cus/AExpo.git .
    
    # Create .env from example
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_message ".env file created from .env.example"
        print_warning "Please edit $APP_DIR/.env with your configuration"
    fi
else
    print_message "Downloading deployment script..."
    cd $APP_DIR
    wget -q https://raw.githubusercontent.com/us3cus/AExpo/main/deploy.sh
    chmod +x deploy.sh
fi

echo ""
echo "================================================"
print_message "✅ VPS setup completed successfully!"
echo "================================================"
echo ""
print_message "Next steps:"
echo "  1. Configure environment variables in $APP_DIR/.env"
echo "  2. Run deployment script: cd $APP_DIR && ./deploy.sh"
echo "  3. Configure Nginx reverse proxy (if installed)"
echo "  4. Obtain SSL certificate with Certbot (if installed)"
echo ""
print_warning "Note: You may need to log out and log back in for Docker group changes to take effect"
echo ""
