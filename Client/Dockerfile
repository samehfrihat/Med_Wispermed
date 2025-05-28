FROM node:14.17.6-alpine

# set working directory
WORKDIR /src

# add `/app/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
 
# add app
COPY . ./

EXPOSE 3000

# start app
CMD ["npm", "start"]
