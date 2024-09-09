# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally (if needed)
RUN npm install -g typescript

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Copy the views directory to the dist folder
RUN cp -R views dist/

# Expose the port the app runs on (8080 internally)
EXPOSE 8000

# Define the command to run the application
CMD ["node", "dist/index.js"]
