#!/bin/bash

# Deployment script for AExpo on VPS
# This script should be run on the VPS server

set -e

echo "🚀 Starting AExpo deployment..."

# Configuration
APP_DIR="${APP_DIR:-/opt/aexpo}"
GITHUB_USER="${GITHUB_USER:-us3cus}"
GITHUB_REPO="${GITHUB_REPO:-AExpo}"
BRANCH="${BRANCH:-main}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create application directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
    print_message "Creating application directory: $APP_DIR"
    sudo mkdir -p "$APP_DIR"
    sudo chown $USER:$USER "$APP_DIR"
fi

# Navigate to application directory
cd "$APP_DIR"

# Clone or update repository
if [ ! -d ".git" ]; then
    print_message "Cloning repository..."
    git clone "https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git" .
else
    print_message "Updating repository..."
    git fetch origin
    git reset --hard "origin/${BRANCH}"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating template..."
    cat > .env << EOF
# Environment variables for AExpo
NODE_ENV=production
HOST=0.0.0.0
PORT=3000

# Add your environment variables here
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_REGION=
# S3_BUCKET_NAME=
EOF
    print_warning "Please configure .env file before starting the application"
fi

# Build and start containers
print_message "Building and starting containers..."
docker compose down 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

# Wait for the application to start
print_message "Waiting for application to start..."
sleep 5

# Check if the application is running
if docker compose ps | grep -q "Up"; then
    print_message "✅ Deployment successful!"
    print_message "Application is running at http://localhost:3000"
    
    # Show running containers
    print_message "Running containers:"
    docker compose ps
else
    print_error "❌ Deployment failed. Application is not running."
    print_error "Check logs with: docker compose logs"
    exit 1
fi

# Clean up old images
print_message "Cleaning up old Docker images..."
docker image prune -af

echo ""
print_message "🎉 Deployment completed successfully!"
echo ""
print_message "Useful commands:"
echo "  - View logs: docker compose logs -f"
echo "  - Restart: docker compose restart"
echo "  - Stop: docker compose down"
echo "  - Update and redeploy: $0"
