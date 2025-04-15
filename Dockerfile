# Use official Node image
FROM node:20

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "app.js"]
