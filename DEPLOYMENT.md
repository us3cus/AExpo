# Deployment Guide

## На VPS сервере выполните:

```bash
# 1. Установите Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Установите PM2 глобально
sudo npm install -g pm2

# 3. Настройте PM2 для автозапуска
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# 4. Создайте директорию для логов
mkdir -p /var/www/temten.me/logs

# 5. Обновите Nginx конфигурацию
sudo nano /etc/nginx/sites-available/temten.me
# Вставьте содержимое из nginx.conf

# 6. Проверьте и перезапустите Nginx
sudo nginx -t
sudo systemctl reload nginx

# 7. Проверьте файрволл
sudo ufw allow 3000/tcp
```

## Автоматический деплой

Push в ветку `main` автоматически:
1. Собирает SSR версию приложения
2. Копирует на VPS
3. Перезапускает через PM2

## Мониторинг

```bash
# Логи PM2
pm2 logs temten-app

# Статус
pm2 status

# Мониторинг
pm2 monit
```
