FROM mhart/alpine-node:8.9.4
WORKDIR /app
WORKDIR /app
ADD ./package.json /app/package.json
RUN npm install
ADD . /app
CMD ["node", "bin/www"]
