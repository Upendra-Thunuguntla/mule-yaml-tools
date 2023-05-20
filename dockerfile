FROM nginx:alpine
LABEL maintainer="Upendra Venkata Muralidhar Thunuguntla -  muralidhar.thunuguntla@gmail.com"

# Copy all files to the nginx default directory
COPY . /usr/share/nginx/html/

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
