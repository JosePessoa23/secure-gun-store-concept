# Use the official Node.js 20 image as the base image
FROM node:20

# Create and change to the app directory
WORKDIR /app

# Copy only package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies for the whole workspace
RUN npm install

# Copy only the backend application code
COPY backend ./backend

# Build the backend application
WORKDIR backend
RUN npx nx run backend:build

# Expose the port the app runs on
EXPOSE 3000

# Start the backend application
CMD ["node", "dist/backend/main.js"]
