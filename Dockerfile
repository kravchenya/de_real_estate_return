# Step 1: Build the Angular application in a Node.js environment

FROM node:20.9.0 AS build-step

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json /app/

# Install the Angular CLI and node modules
RUN npm install -g @angular/cli && npm install

# Copy the rest of the application
COPY . .

# Build the Angular application
RUN ng build

# Step 2: Serve the built Angular application using an Nginx web server

FROM nginx:1.25.3

# Copy the dist folder from build stage to nginx's html folder
COPY --from=build-step /app/dist/* /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Use custom nginx configuration if needed (uncomment next line if you have a custom nginx.conf)
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
