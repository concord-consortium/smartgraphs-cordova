rm -rf platforms/ios
cordova platform add ios

cordova plugin remove org.apache.cordova.statusbar
cordova plugin add org.apache.cordova.statusbar

cordova plugin remove com.adobe.plugins.GAPlugin
cordova plugin add https://github.com/phonegap-build/GAPlugin.git#GA-3.0

cordova build
