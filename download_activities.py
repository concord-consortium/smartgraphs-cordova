#!/usr/bin/env python

import os
import re
import urllib

"""
usage ./download_activities.python
Assumes: a file named www/menu/source.html  (menu_in_file)
Assumes: a smartgraphs project directory in ./smartgraphs
Changes: 
  * Will remove *.js files from ./smartgraphs/apps/smartgraphs/activity_json
  * Will copy activity json specified by the source.html file into above path.
"""

js_activity_tempalte = """
Smartgraphs.activityDocs = Smartgraphs.activityDocs || {};
Smartgraphs.activityDocs["%s"] =  %s;
"""

projectRoot = os.getcwd()

sgRoot = os.path.join(projectRoot, "smartgraphs", "apps", "smartgraphs")
sgActivityRoot = os.path.join(sgRoot, "activity_json")
menu_in_file = os.path.join(projectRoot, "www", "menu", "source.html")
menu_out_file = os.path.join(projectRoot, "www", "menu", "index.html")
json_outdir = sgActivityRoot
url_regex = "(https?://smartgraphs-authoring.concord.org/activities/[^\"]+)"

if os.path.exists(menu_in_file):
    if not os.path.exists(json_outdir):
        os.makedirs(json_outdir)

    regex = re.compile(url_regex, re.IGNORECASE | re.MULTILINE)
    menu_source_html = ""

    with open(menu_in_file,'r') as source:
        menu_source_html = source.read()
    urls = regex.findall(menu_source_html)
    hashUrls = {}
    for url in urls:
        act_name = re.sub("[0-9]+-","",url.split("/")[-2])
        act_name = "/shared/%s" % (act_name)
        json_url = "%s.json" %(url)
        filename = "%s.js" %(json_url.split("/")[-2])
        hashUrls[url] = "index.html#%s" % (act_name)
        filename = os.path.join(sgActivityRoot,filename)
        print("downloading %s" % (json_url))
        print("to %s" % (filename))
        json_source = urllib.urlopen(json_url)
        json_data = json_source.read()

        with open(filename,"w") as dest:
            dest.write(js_activity_tempalte % (act_name,json_data))
        menu_source_html = re.sub(url,hashUrls[url],menu_source_html)
    with open(menu_out_file,'w') as output:
        output.write(menu_source_html)