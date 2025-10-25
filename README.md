AExpo — это веб приложение на базе Nuxt.js, имеющее функционал социальной сети.

[![CI/CD Pipeline](https://github.com/us3cus/AExpo/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/us3cus/AExpo/actions/workflows/ci-cd.yml)

Функционал:
  
  Создание профиля
  
  Кастомизация профиля

  Просмотр других профилей

  Создание постов

Технологии:

    Frontend: Nuxt.js, TailWind, NuxtUI

    Backend: NestJs, MongoDB, PostgreSQL

## Deployment

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick start:
- **VPS Setup**: Run `./setup-vps.sh` on your VPS
- **Deploy**: Run `./deploy.sh` to deploy the application
- **CI/CD**: GitHub Actions automatically builds and deploys on push to main branch

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
