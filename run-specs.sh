#!/bin/bash

echo Starting server
./bin/www > /dev/null &
NODE_PID=$!
echo PID: $NODE_PID
npm test
echo Killing server with PID: $NODE_PID
kill $NODE_PID
