#!/usr/bin/env node

//
// This hook copies various resource files
// from our version control system directories
// into the appropriate platform specific location
//


// configure all the files to copy.
// Key of object is the source file,
// value is the destination location.
// It's fine to put all platforms' icons
// and splash screen files here, even if
// we don't build for all platforms
// on each developer's box.

var filestocopy = [
// iOS icons
{
    "res/icons/ios/icon-40.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-40.png"
}, {
    "res/icons/ios/icon-40@2x.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-40@2x.png"
},  {
    "res/icons/ios/icon-40.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-50.png"
}, {
    "res/icons/ios/icon-40@2x.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-50@2x.png"
}, {
    "res/icons/ios/icon-60.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-60.png"
}, {
    "res/icons/ios/icon-60@2x.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-60@2x.png"
}, {
    "res/icons/ios/icon-60.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-72.png"
}, {
    "res/icons/ios/icon-60@2x.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-72@2x.png"
}, {
    "res/icons/ios/icon-76.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-76.png"
}, {
    "res/icons/ios/icon-76@2x.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-76@2x.png"
}, {
    "res/icons/ios/icon-small.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-small.png"
}, {
    "res/icons/ios/icon-small@2x.png":
    "platforms/ios/African\ Lions/Resources/icons/icon-small@2x.png"
}, {
    "res/icons/ios/icon.png":
    "platforms/ios/African\ Lions/Resources/icons/icon.png"
}, {
    "res/icons/ios/icon@2x.png":
    "platforms/ios/African\ Lions/Resources/icons/icon@2x.png"
},
// iOS splash screens
{
    "res/screens/ios/Default-Landscape@2x~ipad.png":
    "platforms/ios/African\ Lions/Resources/splash/Default-Landscape@2x~ipad.png"
}, {
    "res/screens/ios/Default-Landscape~ipad.png":
    "platforms/ios/African\ Lions/Resources/splash/Default-Landscape~ipad.png"
}, {
    "res/screens/ios/Default~iphone.png":
    "platforms/ios/African\ Lions/Resources/splash/Default~iphone.png"
}, {
    "res/screens/ios/Default@2x~iphone.png":
    "platforms/ios/African\ Lions/Resources/splash/Default@2x~iphone.png"
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
}
];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            console.log("copying "+srcfile+" to "+destfile);
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});
