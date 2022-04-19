# pull official base image
FROM node:12.22.12-buster

# set working directory
WORKDIR /app

RUN apt-get update -y
RUN apt-get install -y libudev-dev libusb-1.0

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

# start app
CMD ["npm", "start"]    

