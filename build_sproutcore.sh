#!/bin/bash
[ -s "$HOME/.rvm/scripts/rvm" ] && . "$HOME/.rvm/scripts/rvm"

rvm ruby-1.9.3

# remove all the old activity, and build files:
rm -rf ./smartgraphs/apps/smartgraphs/activity_json/*.js
rm -rf ./smartgraphs/tmp

# remove our local web files:
rm -rf ./www/images
rm -rf ./www/static

# Load the activity data from the authoring site.
./download_activities.py

# build SmartGraphs
cd smartgraphs
bundle install
bundle exec sc-build smartgraphs -r

# Copy the SmartGraphs runtime
cd ..
rm -rf ./www/static
cp -r smartgraphs/tmp/build/static www
