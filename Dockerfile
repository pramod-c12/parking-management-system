# Use official Node image
FROM node:23-slim

# Install netcat for wait-for-db.sh
RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Add and give execute permission to wait script
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Expose port
EXPOSE 5000

# Start app using the wait script
CMD ["/wait-for-db.sh", "node", "app.js"]
