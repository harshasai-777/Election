# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
# Note: For Vite, environment variables used in the frontend must be available during build time.
# In Cloud Build/Run, you would pass these as build arguments.
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine

WORKDIR /app

# Install 'serve' to run the static site
RUN npm install -g serve

# Copy the built output from the build stage
COPY --from=build /app/dist ./dist

# Cloud Run sets the PORT environment variable (default 8080).
# The 'serve' package automatically listens on $PORT.
ENV PORT=8080
EXPOSE 8080

# Serve the static files
CMD serve -s dist -l tcp://0.0.0.0:$PORT
