# Create image and buiild the base
FROM node:16-alpine AS base
WORKDIR /usr/src/app

# copy package.json and package-lock.json files
COPY package*.json ./
# install dependencies
RUN npm install
# copy project files
COPY . .
# compile code
RUN npm run build
# build and Test the built artifact
RUN npm test

# # create a production image using a smaller base image
FROM node:16-alpine AS production
WORKDIR /usr/src/app

# copy compiled files from builder stage
COPY --from=base /usr/src/app/build .
COPY --from=base /usr/src/app/node_modules /usr/src/app/node_modules

# expose the port the app runs on
EXPOSE 4321

# define the command to start the app
CMD ["node", "src/server.js"]
