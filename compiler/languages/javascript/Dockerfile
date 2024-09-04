# Use the official Node.js image.
FROM node:14

# Create and set the working directory
WORKDIR /code

# Install any required packages
RUN npm install -g eslint

# Copy the code into the container
COPY . /code

# Default command to run
CMD ["node", "script.js"]
