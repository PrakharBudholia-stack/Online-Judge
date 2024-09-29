# Use the official Node.js image as the base image
FROM node:20

# Set the working directory for the backend
WORKDIR /app

# Install Python, g++, and javac
RUN apt-get update && \
    apt-get install -y python3 python3-pip g++ default-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Remove existing node_modules and package-lock.json
RUN rm -rf node_modules package-lock.json

# Install backend dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Remove existing node_modules and package-lock.json in frontend
RUN rm -rf frontend/node_modules frontend/package-lock.json

# Install frontend dependencies
RUN npm install --prefix frontend

# Expose the ports for the backend and frontend
EXPOSE 3000 5000

# Start both the backend and frontend concurrently
CMD ["npm", "run", "start:all"]