#!/usr/bin/env python
# -*- coding: utf-8 -*-

import codecs
import os
import re
import urllib2
import json
import pdb

"""
usage ./download_activities.python
Assumes: a file named www/menu/index.source_html  (menu_in_file)
Assumes: a smartgraphs project directory in ./smartgraphs
Changes: 
  * Will remove *.js files from ./smartgraphs/apps/smartgraphs/activity_json
  * Will copy activity json specified by the source.html file into above path.
"""

js_activity_template = u"""
Smartgraphs.activityDocs = Smartgraphs.activityDocs || {};
Smartgraphs.activityDocs["%s"] =  %s;
"""

projectRoot = os.getcwd()

sgRoot = os.path.join(projectRoot, "smartgraphs", "apps", "smartgraphs")
sgActivityRoot = os.path.join(sgRoot, "activity_json")
menu_in_file = os.path.join(projectRoot, "www", "menu", "index.source_html")
menu_out_file = os.path.join(projectRoot, "www", "menu", "index.html")
json_outdir = sgActivityRoot
url_regex = "(https?://smartgraphs-authoring.*concord.org/activities/[^\"]+)"

if os.path.exists(menu_in_file):
    if not os.path.exists(json_outdir):
        os.makedirs(json_outdir)

    regex = re.compile(url_regex, re.IGNORECASE | re.MULTILINE)
    menu_source_html = ""

    with codecs.open(menu_in_file,'r','utf-8') as source:
        menu_source_html = source.read()
    urls = regex.findall(menu_source_html)
    hashUrls = {}
    for url in urls:
        # this block is trying to standardize the activity name
        # the URLS don't have comma's but some of the activities
        # have internal URLS with commas in them, randomly.
        # Also the URLs sometimes have numbers, but internally not.
        json_url     = "%s.json" %(url.strip())
        json_source  = urllib2.urlopen(json_url)
        json_data    = unicode(json_source.read(),'utf-8')

        json_data = re.sub("click","tap", json_data)
        json_data = re.sub("Click","Tap", json_data)
        
        #
        activity_data= json.loads(json_data)
        ori_act_name = re.sub("\.df[0-9]+","",activity_data[u"_id"])
        act_name     = re.sub(",","",ori_act_name)
        json_data    = re.sub(ori_act_name,act_name,json_data)
        
        act_name = "/shared/%s" % (act_name)
        
        filename = "%s.js" %(json_url.split("/")[-2])
        hashUrls[url] = "../index.html#%s" % (act_name)
        filename = os.path.join(sgActivityRoot,filename)
        print("downloading %s" % (json_url))
        print("to %s" % (filename))


        with codecs.open(filename, "w",'utf-8') as dest:
            dest.write(js_activity_template % (act_name, json_data))
        menu_source_html = re.sub(url,hashUrls[url],menu_source_html)
    with codecs.open(menu_out_file,'w','utf-8') as output:
        output.write(menu_source_html)