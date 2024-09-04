# Base image for the sandbox
FROM node:14

# Install required dependencies (if any)
RUN npm install -g eslint

# Create a working directory
WORKDIR /code

# Copy code into the container
COPY . /code

# Command to run by default
CMD ["node", "sandbox.js"]
