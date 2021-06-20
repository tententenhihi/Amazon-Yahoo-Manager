# Setup - Server
- Window:
- npm install
- npm install -g win-node-env
- Tạo file settings.js từ file setting-default.js trong src/configs

# Update Server
cd Amazon-Yahoo-Manager/server/; git pull; npm run build; pm2 delete www; pm2 start dist/bin/www.js
cd Amazon-Yahoo-Manager/client/; git pull; npm run build; sudo rm -r /var/www/dist; sudo cp -r dist /var/www/dist
