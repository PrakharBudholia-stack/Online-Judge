#!/bin/bash

# Remove all stopped containers
docker container prune -f

# Remove all unused images
docker image prune -a -f
