# Stage 1: Build the React application
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy the package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies using bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the application (Vite outputs to 'dist')
RUN bun run build

# Stage 2: Serve the application
FROM oven/bun:1-alpine
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy the entrypoint script
COPY entrypoint.sh .

# Make the script executable
RUN chmod +x entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Set the script as the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Start a static file server to serve the built assets on port 3000
CMD ["bunx", "serve", "-s", "dist", "-l", "3000"]