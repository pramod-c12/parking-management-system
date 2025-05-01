# Use a stable Node LTS version
FROM node:20-slim

# Install netcat for wait-for-db script
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy app source code
COPY . .

# Copy and make wait script executable
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Expose port (Render may override this with PORT env var)
EXPOSE 5000

# Start app (use wait-for-db for local dev; Render may not need it)
CMD ["/wait-for-db.sh", "node", "app.js"]