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

These settings should be preserved after re-building, but may not always be.
