FROM node:18

# 작업 디렉토리 설정
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm install -g @nestjs/cli && npm install --production

EXPOSE 5000

CMD ["npm", "run", "start:prod"]