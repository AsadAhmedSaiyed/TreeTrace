# Use an official Node.js runtime as a parent image
# node:20-slim is a good balance between size and compatibility
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install production dependencies only
# We use 'ci' for more reliable builds in containers
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (defaults to 5000 in your index.js)
EXPOSE 5000

# Define environment variables with default values if needed
# Note: Sensitive keys should be passed at runtime, not hardcoded here.
ENV PORT=5000
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
