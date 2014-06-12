/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        StatusBar.styleDefault();
        StatusBar.backgroundColorByHexString("#ECECEC");

        // Here we create a new object which will clobber the Google Analytics
        // array, _gaq, with our plugin wrapper, so that all calls to _gaq.push
        // will use the plugin code instead.
        window._gaq = new GAPluginWrapper("UA-6899787-41")
    }
};

var GAPluginWrapper = function(trackingId) {
    this.gaPlugin = window.plugins.gaPlugin;
    this.gaPlugin.init(null, null, trackingId, 10);
}

function successHandler()
{
    console.log("success!");
}

function errorHandler()
{
    console.log("failed...");
}

// The only event SmartGraphs sends is in the form
// _gaq.push(["_trackEvent", "SmartGraphs Activities", key, value]);
GAPluginWrapper.prototype.push = function(arr) {
    var key   = arr[2],
        value = arr[3];
    console.log("GA trying")
    this.gaPlugin.trackEvent(successHandler, errorHandler, "Event", key, value);
}
