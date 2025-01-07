#!/bin/bash

# Install required dependencies
echo "Installing dependencies with npm..."
npm install

# Attempt to fix potential issues with dependencies
echo "Running npm audit fix..."
npm audit fix

# Check if port 8000 is already in use and terminate the process
PORT=8000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "Port $PORT is already in use. Terminating the process..."
    kill -9 $(lsof -Pi :$PORT -sTCP:LISTEN -t)
fi

# Start the Python HTTP server
echo "Starting the Python HTTP server on port $PORT..."
python3 -m http.server $PORT &

# Save the process ID of the server
SERVER_PID=$!
echo "Python HTTP server started with PID $SERVER_PID."

# Wait for the server to start
sleep 2

# Open the game in the default browser
echo "Opening the game in the browser..."
open http://127.0.0.1:$PORT/

# Notify the user
echo "The game is running! Press CTRL+C to stop the server."

# Wait for the user to manually close the script or interrupt
trap 'echo "Stopping the Python HTTP server..."; kill $SERVER_PID; echo "Server stopped."; exit' SIGINT SIGTERM

# Keep the script running to allow for manual termination
wait $SERVER_PID
