#!/bin/bash
set -e


COUNTER=0
# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173; do
  sleep 5
  COUNTER=$(( COUNTER + 1 ))
  if [ $COUNTER -gt 11 ]; then
    echo "Timeout waiting for server"
    curl -v http://localhost:4173
    exit 1
  fi
done

bun playwright test
