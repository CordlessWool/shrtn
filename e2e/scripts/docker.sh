#!/bin/bash
set -e



# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173; do
  sleep 3
  curl -v http://localhost:4173
done

bun playwright test
