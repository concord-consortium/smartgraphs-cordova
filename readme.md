SmartGraphs Cordova Project
===========================

To setup Cordova:

    sudo npm install -g cordova
    sudo npm install -g ios-sim

    npm install

Setting up Android Developer Environment
========================================

<http://cordova.apache.org/docs/en/3.5.0/guide_platforms_android_index.md.html>


Building African Lions app:
===========================

1. Switch to the African Lions branch

        git checkout african-lions

2. Add the iOS and Android platforms in Cordova

        cordova platform add ios
        cordova platform add android

3. Install the plugins

        ./install_plugins.sh

    note that this step will generally need to be repeated if you modify your plugins or
    blow away the built products, which is why that script includes the uninstall commands
    first before installing.

4. Build the app

        cordova build

    or, optionally

        cordova build ios
        cordova build android

    When you add the platforms and build the apps, besides the standard Cordova build process the
    scripts in hooks/ are also run. Currently these are

    ### after_platform-add:

    * Sets landscape orientation on Android by modifying the AndroidManifest
    * Sets landscape orientation on iPhones and iPads by modifying the plist
    * Set deployment target (iPad, iOS 7.1) by modifying the pbxproj file

    ### after_prepare:

    * copies all icons and splashscreens to the correct locations



Testing and deploying the app
=============================

iOS
---

1. Open the file platforms/ios/African Lions.xcodeproj in Xcode.

2. Select either an emulator or a physical device from the pulldown menu at the top left

3. Click the Play button to send the app to the device.


Android
-------

1. After building for Android, plug in a device (one that allows external installation) and run

        cordova run android


Building a SmartGraphs project and adding it to the app
=======================================================

The following assumes that the [Smartgraphs project](https://github.com/concord-consortium/Smartgraphs)
is already checked out and is buildable:

Remove all activities but the one(s) you want to deploy from Smartgraphs/apps/smartgraphs/activity_json.

Build SG

    cd path/to/Smartgraphs
    rm -rf tmp
    sc-build

Copy the /tmp/build/static folder to smartgraphs-cordova/www/static

Move the file www/static/smartgraphs/en/[id]/indev.html to www/index.html

Run the python script to make all absolute urls starting with "/static" be relative urls

    cd path/to/smartgraphs-cordova
    python -c 'import sgutils; sgutils.makeRelativeUrls()'

You can update the HTML template with the latest SmartGraphs build:

    python -c 'import sgutils; sgutils.copyHtmlTemplate("cfb1ca9612cdaa7efde804c77be1d423b41f0991")'

Or manually nsert the following cordova-specific blocks in index.html (copied from Cordova's generated index.html file):

Before the first `<meta>` tag:

    <meta charset="utf-8" />
    <meta name="format-detection" content="telephone=no" />
    <!-- WARNING: for iOS 7, remove the width=device-width and height=device-height attributes. See https://issues.apache.org/jira/browse/CB-4323 -->
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
    <meta name="msapplication-tap-highlight" content="no" />

After the opening `<body>` tag:

    <script type="text/javascript" src="cordova.js"></script>
    <script type="text/javascript" src="js/index.js"></script>
    <script type="text/javascript">
      app.initialize();
    </script>
    <script>
      window.location.hash = "/shared/african-lions-modeling-populations";
      window.showOutline = false; window.showEditButton = false;
      String.preferredLanguage = "en";
    </script>

(change location hash as appropriate.)

Build the app using

    cordova build
