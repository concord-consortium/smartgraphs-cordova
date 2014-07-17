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
        window._gaq = new GAPluginWrapper("UA-6899787-41");
        app.replaceLinks();
        app.addPageRelayoutListener();
        document.addEventListener('hidekeyboard', app.onKeyboardHide, false);
        document.addEventListener('showkeyboard', app.onKeyboardShow, false);
    },

    onKeyboardShow: function() {
        app.scrollTextIntoView();
        return true;
    },

    onKeyboardHide: function() {
        return true;
    },

    scrollTextIntoView: function() {
        setTimeout(function() {
            $("textarea").each(function(i,el) { el.scrollIntoView(); });
        }, 500);
    },


    replaceLinks: function() {
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        // fired when a mutation occurs
        var observer = new MutationObserver(function() {
            $("a").each(function() {
                var href = $(this).attr("href");
                var span = $("<span class='pseudolink'>");
                span.html($(this).html());
                span.bind('touchstart', function() {
                    var ref = window.open(href,'_system');
                });
                $(this).replaceWith(span);
            });
        });

        observer.observe(document, {
          subtree: true,
          childList: true
        });
    },



    // This is an annoying hack to force a relayout of the page when we switch pages.
    // This is to fix a bug where, on a small screen, being at the bottom of the scroll
    // on one page and then switching to the next page will layout the new page with
    // some of the top of the left pane cut off.
    addPageRelayoutListener: function() {
        // only add this for smaller devices
        if (screen.height > 600 && screen.width > 1000) {
            return;
        }

        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        // fired when a mutation occurs
        var observer = new MutationObserver(function() {
            var el = $(".sc-view.sc-static-layout").first(),
                position = $(".sc-view.sc-static-layout").first().css("position");
            // force relayout
            el.css({position: "fixed"});
            el[0].offsetTop;     // doing this forces the browser to recalculate the layout, so we don't need a timeout
            el.css({position: position});
        });

        observer.observe(document, {
          subtree: true,
          childList: true
        });
    },

    // This is an annoying hack to force a relayout of the page when we switch pages.
    // This is to fix a bug where, on a small screen, being at the bottom of the scroll
    // on one page and then switching to the next page will layout the new page with
    // some of the top of the left pane cut off.
    addPageRelayoutListener: function() {
        // only add this for smaller devices
        if (screen.height > 600 && screen.width > 1000) {
            return;
        }

        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        // fired when a mutation occurs
        var observer = new MutationObserver(function() {
            var el = $(".sc-view.sc-static-layout").first(),
                position = $(".sc-view.sc-static-layout").first().css("position");
            // force relayout
            el.css({position: "fixed"});
            el[0].offsetTop;     // doing this forces the browser to recalculate the layout, so we don't need a timeout
            el.css({position: position});
        });

        observer.observe(document, {
          subtree: true,
          childList: true
        });
    }
};

var GAPluginWrapper = function(trackingId) {
    this.gaPlugin = window.plugins.gaPlugin;
    this.gaPlugin.init(null, null, trackingId, 10);
};

// The only event SmartGraphs sends is in the form
// _gaq.push(["_trackEvent", "SmartGraphs Activities", key, value]);
GAPluginWrapper.prototype.push = function(arr) {
    var key   = arr[2],
        value = arr[3];

    this.gaPlugin.trackEvent(null, null, "Event", key, value);
};
