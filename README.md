# Setup - Server
- Window:
- npm install
- npm install -g win-node-env
- Tạo file settings.js từ file setting-default.js trong src/configs
# Setup Puppeteer
apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev

# Update Server
cd /root/Amazon-Yahoo-Manager; git pull origin main; cd server/; npm run build; pm2 delete all; pm2 start dist/bin/www
cd /root/Amazon-Yahoo-Manager; git pull origin main; cd client/; npm run build; rm -r /var/www/dist; cp -r dist/ /var/www/

