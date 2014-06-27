# Clean everything and start again. 
# Shouldn't have to do this usually.
cordova platform remove ios
cordova platform remove android
rm -rf ./platforms

cordova plugin remove org.apache.cordova.statusbar
cordova plugin remove com.adobe.plugins.GAPlugin
cordova plugin remove org.apache.cordova.inappbrowser

cordova platform add ios
cordova platform add android

cordova build

cordova plugin add org.apache.cordova.statusbar
cordova plugin add https://github.com/phonegap-build/GAPlugin.git#GA-3.0
cordova plugin add org.apache.cordova.inappbrowser

cordova build
./remove_unused_regions.py `pwd`