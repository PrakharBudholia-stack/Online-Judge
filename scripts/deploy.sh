#!/bin/bash

echo "Starting deployment process..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build the frontend
cd frontend
npm run build
cd ..

# Restart the server
pm2 restart server

echo "Deployment completed successfully!"
