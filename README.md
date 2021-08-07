# Setup - Server
- Window:
- npm install
- npm install -g win-node-env
- Tạo file settings.js từ file setting-default.js trong src/configs
# Setup Puppeteer
apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev

# Update Server
cd /root/Amazon-Yahoo-Manager; git pull origin main; cd server/; npm run build; export NODE_ENV=production; pm2 delete all; pm2 start dist/bin/www.js
cd /root/Amazon-Yahoo-Manager; git pull origin main; cd client/; npm run build; rm -r /var/www/dist; cp -r dist/ /var/www/

# Set timezone
timedatectl set-timezone "Asia/Tokyo"


sudo apt install wget; wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash ; source ~/.profile ; nvm install 12.14.0; sudo apt install npm; sudo apt install unzip ; sudo apt install unrar;sudo apt install git ;git config --global credential.helper store; git clone https://github.com/bacnt2412/Amazon-Yahoo-Manager.git; export NODE_OPTIONS=--max-old-space-size=8192; sudo ln -s /usr/bin/python3 /usr/bin/python; sudo timedatectl set-timezone Asia/Ho_Chi_Minh; sudo apt install ufw ; sudo ufw enable; sudo ufw status; sudo ufw allow ssh; sudo ufw allow http; sudo ufw allow https; npm install -g pm2; sudo apt install nginx; apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev;cd /etc/nginx/sites-enabled/; rm -r default; export NODE_ENV=production


server {
    listen      80;
    server_name xxxxx;
    charset utf-8;
    root    /var/www/dist;
    index   index.html index.htm;
    # Always serve index.html for any request
    location / {
        root /var/www/dist;
        try_files $uri /index.html;
    }
    error_log  /var/log/nginx/vue-app-error.log;
    access_log /var/log/nginx/vue-app-access.log;
}

server {
    listen 3000;
    server_name api.xxx.com;
    client_max_body_size 2G;
    location / {
        proxy_pass http://localhost:5000; #whatever port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    proxy_hide_header X-Powered-By;
    server_tokens off;
}

