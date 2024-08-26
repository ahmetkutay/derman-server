# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# If TypeScript is used, install it globally (optional)
RUN npm install -g typescript

# Copy the environment configuration file
COPY .env .env

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Expose the port the app runs on
EXPOSE 8000

# Define the command to run the application
CMD ["node", "dist/index.js"]