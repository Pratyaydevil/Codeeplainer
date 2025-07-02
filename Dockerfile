# Use official Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy project files
COPY package*.json ./
RUN npm install

COPY . .

# Expose port
EXPOSE 7860

# Start the app
CMD ["node", "server.js"]
