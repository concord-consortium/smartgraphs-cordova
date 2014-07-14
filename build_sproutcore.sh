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
bundle exec sc-build smartgraphs -r --languages=en

# Copy the SmartGraphs runtime
cd ..
cp -r smartgraphs/tmp/build/static www

# Save the build number:
SG_BUILD=`ls ./www/static/smartgraphs/en`

# Save our project name:
PROJECT_NAME=`./project_name.js`

echo "using build $SG_BUILD for project $PROJECT_NAME"

python -c "import sgutils; sgutils.copyHtmlTemplate('$SG_BUILD')"
python -c 'import sgutils; sgutils.makeRelativeUrls()'
cordova build ios
open "./platforms/ios/$PROJECT_NAME.xcodeproj"