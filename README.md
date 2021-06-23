# Setup - Server
- Window:
- npm install
- npm install -g win-node-env
- Tạo file settings.js từ file setting-default.js trong src/configs

# Update Server
cd /root/Amazon-Yahoo-Manager
git pull origin feature/nghdung
cd server/
npm i
npm run build
pm2 delete www
pm2 start dist/bin/www.js
cd ../client
npm i
npm run build
sudo rm -r /var/www/dist
sudo cp -r dist /var/www/dist
