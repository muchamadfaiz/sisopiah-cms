# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the rest of the app code to the working directory
COPY . .

# Build the ReactJS app
RUN npm run build

# Set the environment variables
ENV REACT_APP_API_BASE_URL=https://surabah.kardiaq.id

EXPOSE 3000

# Set the startup command to serve the app
CMD ["npm", "start"]