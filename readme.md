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

1. Bump the version and / or build number in config.xml

1. cordova build ios

1. After building the app run `./remove_unused_regions.py`

1. Open the file platforms/ios/African Lions.xcodeproj in Xcode.

1. Remove unused language resources in the project browser in Resources/*.lproj

1. Select either an emulator or a physical device from the pulldown menu at the top left

1. Click the Play button to send the app to the device.

1. To create an IPA for TestFlight or the iTunes store:
  
    1. Make sure your IOS Device is connected, and chosen in the devlice pulldown at the top left.

    1. Select menu → "Product" → "Archive".

    1. The first item on the archives screen displayed next is the most recent archive.

    1. Click on "Distribute". 

    1. For Test Flight, select "Save for Enterprise and Ad Hock Deployment" – sign with the Concord Provisioning profile.

    1. For the "iOS App Store" Use the "CC Apple Store Distrobution 2014" profile.


Android
-------

1. After building for Android, plug in a device (one that allows external installation) and run

        cordova run android

    Note that this will re-build the project without the after_build hooks, for some bizarre reason.
    To load the app on the device with the after_build hooks intact (device orientation fix, etc),
    build the project (`cordova build android`), open the project in the Eclipse SDK, and run using
    the run button.


Building the android APK file for distribution:
===============================================

To build the App for distribution you need to sign it.
This example creates a key "mykey" in ./default.keystore and uses to
sign the final APK.

1. keytool -genkey -v -keystore ./default.keystore

2. Add the key information in platforms/android/ant.properties:

    ```
    key.store=/Users/npaessel/lab/javascript/sg-cordova/noah-test-key.keystore
    key.alias=mykey
    ```
3. Run the build: `cordova build andoid --release`


Building a SmartGraphs project and adding it to the app
=======================================================

The following assumes that the [Smartgraphs project](https://github.com/concord-consortium/Smartgraphs)
is already checked out and is buildable:

Remove all activities but the one(s) you want to deploy from Smartgraphs/apps/smartgraphs/activity_json.

(Optional -- if you have html file in www/menu/index.source_html that has links to SmartGraphs 
activites on the SmartGraphs authoring server, you can run  `./download_activities.py`, 
which will create new files in Smartgraphs/apps/smartgraphs/activity_json/*.js for you)

(Optional -- you can try running `./build_sproutcore.sh` which will attempt to clean, build, 
and copy SmartGraphs for you, assuming there is a symlink in `./smartgraphs` )

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

Or manually insert the following cordova-specific blocks in index.html (copied from Cordova's generated index.html file):

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
      // uncomment this next line if the app will use a home page
      // window.showHomeButton = true; window.activityHome = '/index.html';
      String.preferredLanguage = "en";
    </script>

(change location hash as appropriate, and set the showHomeButton and activityHome properties as appropriate.)

Build the app using

    cordova build
