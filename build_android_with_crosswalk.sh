# This script re-builds the Cordova project with the CrossWalk WebView
#
# This expects you to have a built Crosswalk-Cordova folder in a sibling folder
# called crosswalk-cordova-6.35.131.12-arm. You can download the prebuilt zip
# from https://crosswalk-project.org/#documentation/downloads
#
# To make a release build, change line 37 (the second ant debug) to ant release.
# You will need to manually sign the release apk, or have your keystore info in
# android-custom-files/ant.properties


# First do a basic fresh Cordova build
# Some or all of this section can be commented-out if you haven't made changes to the project
rm -Rf platforms/android
rm -Rf plugins/*
cordova platform add android
./install_plugins.sh
cordova build android

# Then copy these modified xml files into the newly-built platform
# (see https://www.mail-archive.com/crosswalk-help@lists.crosswalk-project.org/msg00200.html)
cp android-custom-files/AndroidManifest.xml platforms/android
cp android-custom-files/custom_rules.xml platforms/android

# Uncomment this if you are doing a release build and you have an ant.properties file with you keystore info
# cp android-custom-files/ant.properties platforms/android

# Then rebuild project using CrossWalk
# (most of this is from https://crosswalk-project.org/#documentation/cordova/migrate_an_application/migrate-using-command-line-tools)
rm -Rf platforms/android/CordovaLib/*
cp -a ../crosswalk-cordova-6.35.131.12-arm/framework/* platforms/android/CordovaLib/
cp -a ../crosswalk-cordova-6.35.131.12-arm/VERSION platforms/android/
cd platforms/android/CordovaLib/
android update project --subprojects --path . --target "android-19"
ant debug
cd ..
ant debug
cd ../..

# To install on your device, delete the existing app then run
# adb install platforms/android/bin/AfricanLions-debug.apk
# note, this will just install the app, it won't automatically open it
