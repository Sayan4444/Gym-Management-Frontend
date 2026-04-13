#!/bin/sh

# Start writing the window.env object to the env.js file
echo "window.env = {" > /app/dist/env.js

# Find all environment variables that start with VITE_ and write them
env | grep -E '^VITE_' | while read -r line; do
    key=$(echo "$line" | cut -d '=' -f 1)
    value=$(echo "$line" | cut -d '=' -f 2-)
    echo "  $key: \"$value\"," >> /app/dist/env.js
done

# Close the object
echo "};" >> /app/dist/env.js

# Execute the command passed to the docker container (the serve command)
exec "$@"