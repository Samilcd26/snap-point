FROM node:18

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start development server with nodemon for hot reload
CMD ["npm", "run", "dev"] 