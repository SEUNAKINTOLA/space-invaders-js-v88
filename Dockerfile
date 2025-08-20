# Use Node.js LTS version as base image
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g \
    npm@latest \
    jest \
    webpack \
    webpack-cli \
    eslint \
    prettier

# Copy package files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Install Python dependencies for testing
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Expose port for development server
EXPOSE 3000

# Set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Default command to run development server
CMD ["npm", "run", "dev"]

# Labels for container metadata
LABEL maintainer="Space Invaders JS V88 Team" \
      version="1.0" \
      description="Development environment for Space Invaders JS V88"

# Volume for persistent development
VOLUME ["/app/node_modules"]

# Cache bust for development
ARG CACHEBUST=1

# Development specific configurations
RUN echo "NODE_ENV=development" > .env \
    && echo "DEBUG=true" >> .env \
    && echo "WEBPACK_DEV_SERVER_PORT=3000" >> .env

# Setup git config for development
RUN git config --global core.autocrlf input

# Additional development tools
RUN npm install -g \
    nodemon \
    npm-check-updates \
    webpack-dev-server

# Setup testing environment
ENV JEST_JUNIT_OUTPUT_DIR=./test-results/junit/
ENV JEST_JUNIT_OUTPUT_NAME=results.xml

# Create necessary directories
RUN mkdir -p \
    test-results/junit \
    coverage \
    logs

# Set permissions
RUN chown -R node:node /app

# Switch to non-root user for security
USER node