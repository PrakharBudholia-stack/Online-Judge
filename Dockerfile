# Use the official Node.js image as the base image
FROM node:20

# Set the working directory for the backend
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Install frontend dependencies
RUN npm install --prefix frontend

# Expose the ports for the backend and frontend
EXPOSE 3000 5000

# Start both the backend and frontend concurrently
CMD ["npm", "run", "start:all"]