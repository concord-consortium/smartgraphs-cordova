#!/bin/bash

# Build sproutcore and copy the file to /www
./build_sproutcore.sh

# Copy the iOS template, cache images, and make all urls relative

SG_BUILD=`ls ./www/static/smartgraphs/en`
PROJECT_NAME=`./project_name.py`
echo "using build $SG_BUILD for project $PROJECT_NAME"

python -c "import sgutils; sgutils.copyHtmlTemplate('$SG_BUILD', False)"
python -c 'import sgutils; sgutils.makeRelativeUrls()'

rm -Rf platforms/*
rm -Rf plugins/*

cordova platform add ios
./install_plugins.sh
cordova build ios

./remove_unused_regions.py "./platforms/ios/$PROJECT_NAME"
open "./platforms/ios/$PROJECT_NAME.xcodeproj"
