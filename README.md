I. Vps Ubuntu 20.04

1. Setup
    - Puppeteer
        apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev
    - nodejs....
        sudo apt install wget; wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash ; source ~/.profile ; nvm install 12.14.0; sudo apt install npm;sudo apt install unzip ; sudo apt install unrar;sudo apt install git ;git config --global credential.helper store;  export NODE_OPTIONS=--max-old-space-size=8192; sudo ln -s /usr/bin/python3 /usr/bin/python; sudo timedatectl set-timezone "Asia/Tokyo"; sudo apt install ufw ; sudo ufw enable; sudo ufw status; sudo ufw allow ssh; sudo ufw allow http; sudo ufw allow https; npm install -g pm2; sudo apt install nginx; apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev;cd /etc/nginx/sites-enabled/; rm -r default; export NODE_ENV=production; npm install -g yarn
    - mongodb 4.4
        https://docs.mongodb.com/v4.4/tutorial/install-mongodb-on-ubuntu/
    - Fix Mongodb 32MB Ram => 320MB
        db.adminCommand({setParameter: 1, internalQueryExecMaxBlockingSortBytes: 335544320})
    - Nginx config
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
            listen 80;
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
2. Install Project
    - client
        Đổi api url trong config/prod.env.js
        yarn install&&yarn build
        Build xong copy folder dist vào đường dẫn nginx ở trên "root    /var/www/dist"
    - server
        Đổi config trong file config/production.js. 
        Port cùng với port của reverse proxy nginx ở trên 5000 "http://localhost:5000"
        yarn install&&yarn build
        npm install -g pm2
        Sử dụng pm2 để chạy server local.
        pm2 start dist/bin/wwww.js

===================== DONE =========================

