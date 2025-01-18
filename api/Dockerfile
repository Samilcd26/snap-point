FROM node:18 AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production
RUN npm rebuild bcrypt --build-from-source

# Copy built files from builder stage
COPY --from=builder /usr/src/app/build ./build

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"] 