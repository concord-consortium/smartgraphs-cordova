#!/usr/bin/env node

//
// This hook copies various resource files
// from our version control system directories
// into the appropriate platform specific location
//

var fs = require("fs"),
    path = require('path');
    parseString = require('xml2js').parseString,
    projectRoot = process.argv[2],
    projectName = '';

function getProjectName(protoPath){
  var cordovaConfigPath = path.join(protoPath, 'config.xml'),
      xml = fs.readFileSync(cordovaConfigPath, 'utf-8');

  parseString(xml, function (err, result) {
    projectName = result.widget.name[0];
  });
}

getProjectName(projectRoot);

var filestocopy = [
// iOS icons
{
    "res/icons/ios/icon-40.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-40.png"
}, {
    "res/icons/ios/icon-40@2x.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-40@2x.png"
},  {
    "res/icons/ios/icon-40.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-50.png"
}, {
    "res/icons/ios/icon-40@2x.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-50@2x.png"
}, {
    "res/icons/ios/icon-60.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-60.png"
}, {
    "res/icons/ios/icon-60@2x.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-60@2x.png"
}, {
    "res/icons/ios/icon-60.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-72.png"
}, {
    "res/icons/ios/icon-60@2x.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-72@2x.png"
}, {
    "res/icons/ios/icon-76.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-76.png"
}, {
    "res/icons/ios/icon-76@2x.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-76@2x.png"
}, {
    "res/icons/ios/icon-small.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-small.png"
}, {
    "res/icons/ios/icon-small@2x.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon-small@2x.png"
}, {
    "res/icons/ios/icon.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon.png"
}, {
    "res/icons/ios/icon@2x.png":
    "platforms/ios/" + projectName + "/Resources/icons/icon@2x.png"
},
// iOS splash screens
{
    "res/screens/ios/Default-Landscape@2x~ipad.png":
    "platforms/ios/" + projectName + "/Resources/splash/Default-Landscape@2x~ipad.png"
}, {
    "res/screens/ios/Default-Landscape~ipad.png":
    "platforms/ios/" + projectName + "/Resources/splash/Default-Landscape~ipad.png"
}, {
    "res/screens/ios/Default~iphone.png":
    "platforms/ios/" + projectName + "/Resources/splash/Default~iphone.png"
}, {
    "res/screens/ios/Default@2x~iphone.png":
    "platforms/ios/" + projectName + "/Resources/splash/Default@2x~iphone.png"
},
// Android icons
{
    "res/icons/android/icon-48-mdpi.png":
    "platforms/android/res/drawable/icon.png"
}, {
    "res/icons/android/icon-48-mdpi.png":
    "platforms/android/res/drawable-mdpi/icon.png"
}, {
    "res/icons/android/icon-72-hdpi.png":
    "platforms/android/res/drawable-hdpi/icon.png"
}, {
    "res/icons/android/icon-96-xhdpi.png":
    "platforms/android/res/drawable-xhdpi/icon.png"
}, {
    "res/icons/android/icon-144-xhdpi.png":
    "platforms/android/res/drawable-xxhdpi/icon.png"
},
// Android splash screens
 {
    "res/screens/android/splash-mdpi.png":
    "platforms/android/res/drawable-land-mdpi/screen.png"
}, {
    "res/screens/android/splash-hdpi.png":
    "platforms/android/res/drawable-land-hdpi/screen.png"
}, {
    "res/screens/android/splash-xhdpi.png":
    "platforms/android/res/drawable-land-xhdpi/screen.png"
}, {
    "res/screens/android/splash-xxhdpi.png":
    "platforms/android/res/drawable-land-xxhdpi/screen.png"
}
];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(projectRoot, key);
        var destfile = path.join(projectRoot, val);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            console.log("copying "+srcfile+" to "+destfile);
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});
