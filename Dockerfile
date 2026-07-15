# Step 1: Use an official Node.js image as the base for building the app
FROM node:20 AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Build the React application
RUN npm run build

# Step 7: Use an official Nginx image to serve the built app
FROM nginx:alpine

# Step 8: Copy the built React app from the previous stage to the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom NGINX configuration into the appropriate location
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Step 9: Expose the port that Nginx is using
EXPOSE 80
# Step 10: Start Nginx when the container is run
CMD ["nginx", "-g", "daemon off;"]