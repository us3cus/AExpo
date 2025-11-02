#!/bin/bash

echo "=== Диагностика сервера ==="
echo ""

echo "1. Проверка Node.js и PM2:"
node --version
npm --version
pm2 --version

echo ""
echo "2. PM2 процессы:"
pm2 list

echo ""
echo "3. Проверка порта 3000:"
netstat -tulpn | grep :3000 || ss -tulpn | grep :3000

echo ""
echo "4. Тест локального подключения:"
curl -v http://127.0.0.1:3000 2>&1 | head -20

echo ""
echo "5. Проверка файлов приложения:"
ls -la /var/www/temten.me/.output/server/index.mjs

echo ""
echo "6. Последние логи PM2:"
pm2 logs temten-app --lines 100 --nostream

echo ""
echo "7. Логи Nginx:"
sudo tail -n 50 /var/log/nginx/temten.me.error.log

echo ""
echo "8. Проверка Nginx конфигурации:"
sudo nginx -t

echo ""
echo "=== Конец диагностики ==="
