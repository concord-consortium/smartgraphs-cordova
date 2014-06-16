SmartGraphs Cordova Project
===========================

To build and run for iOS:

    sudo npm install -g cordova
    sudo npm install -g ios-sim

    cd path/to/smartgraphs-cordova
    cordova platform add ios
    cordova build
    cordova emulate ios

Note that some features are not actually read from the config.xml file by Cordova, and must
be set manually, either by modifying the built plist file, or by opening the project up in
Xcode and modifying the project there.

Currently, the following steps need to be taken after the project is built:

1. Set landscape orientation on iPhones and iPads using Xcode
2. Set deployment target (iPad, iOS 7.1) using Xcode

These settings should be preserved after re-building, but may not always be.

To load the app onto a registered iPad, open it in Xcode, select the iPad as the target, and click Run.


Building a SmartGraphs project and serving it locally
=====================================================

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

open it in Xcode and click Run to load it onto an iPad or an emulator.


Notes
=====

* If you find the status bar is not working on your built project, particularly if you switch from master back
to a project branch  (and so have lost your built files), you may need to rebuild the project. This has do be done
in an annoyingly exact order, or the plugins may not be added correctly.

        rm -rf platforms/ios
        cordova platform add ios

        cordova plugin remove org.apache.cordova.statusbar
        cordova plugin add org.apache.cordova.statusbar

        cordova plugin remove com.adobe.plugins.GAPlugin
        cordova plugin add https://github.com/phonegap-build/GAPlugin.git#GA-3.0

        cordova plugin remove org.apache.cordova.inappbrowser
        cordova plugin add org.apache.cordova.inappbrowser

        cordova build
