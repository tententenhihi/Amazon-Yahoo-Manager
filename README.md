# Setup - Server
- Window:
- npm install
- npm install -g win-node-env
- Tạo file settings.js từ file setting-default.js trong src/configs

# Update Server
cd /root/Amazon-Yahoo-Manager <br />
git pull origin feature/nghdung <br />
cd server/ <br />
npm i <br />
npm run build <br />
pm2 delete www <br />
pm2 start dist/bin/www.js <br />
cd ../client <br />
npm i <br />
npm run build <br />
sudo rm -r /var/www/dist <br />
sudo cp -r dist /var/www/dist <br />
<br />
