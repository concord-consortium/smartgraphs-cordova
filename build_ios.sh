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

./localize.py 

open "./platforms/ios/$PROJECT_NAME.xcodeproj"

echo "You must now add InfoPlist.strings to your project using Xcode."
echo "After you have added this file to 'Resources', you must click 'localize'"
echo "in the file inspector pane (on the right) and set the files language to 'English'."  
echo "Click additional languages in the file inspector, answering 'Keep File' if any messages pop up."  
echo "Do this same localization procedure for the 'resources/splash/*.png'."