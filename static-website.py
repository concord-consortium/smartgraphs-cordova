#!/usr/bin/env python
# -*- coding: utf-8 -*-
import codecs
import os
import urllib2
import json
import re
from sgutils import replaceRemoteImages, mkdir_p

root_url = "http://smartgraphs-authoring.concord.org/"
projectRoot = os.getcwd()
exportDir = os.path.join(projectRoot, "static-website")
mkdir_p(exportDir)
activities_json_path = "%(root_url)s/activities.json" % locals()
activities_json = urllib2.urlopen(activities_json_path)
activities_json = unicode(activities_json.read(), 'utf-8')
activities_data = json.loads(activities_json)

def act_filename(activity):
    return "%(id)s.html" % {'id': activity.get('id')}

def load_activity_html(activity):
    id = activity.get('id')
    opts = {'root_url': root_url, 'id': id}
    act_url = "%(root_url)s/activities/%(id)s/student_preview.html" % opts
    print "loading %(act_url)s" % locals()
    return unicode(urllib2.urlopen(act_url).read(),'utf-8')

def replace_build_number(activity_html):
    #  TODO: Either change this hardcoded default, or set SG_BUILD_NUMBER in ENV
    sg_buildnumber = os.getenv('SG_BUILD_NUMBER', 'e369622fa5db3be68ebbd56a6f0e85a3bfd05ca0')
    build_string = "/en/%s" % sg_buildnumber
    regex = re.compile(r'/en/[a-f|0-9]*')
    return re.sub(regex, build_string, activity_html)

def write_activity_html(activity):
    filename = "static-website/%s" % act_filename(activity)
    activity_html = load_activity_html(activity)
    activity_html = replace_build_number(activity_html)
    print "writing to %(filename)s" % locals()
    with codecs.open(filename, "w",'utf-8') as dest:
        dest.write(unicode(activity_html))

def add_activity_to_index(activity, index):
    template = """
        <div class="activity">
            <a href="%(path)s">%(id)s - %(name)s</a>
            <div class="info">
                <div class="author">%(author_name)s</div>
                <div class="author">%(cc_project_name)s</div>
            </div>
        </div>
    """
    data = {
        'path': act_filename(activity),
        'id': activity.get('id'),
        'author_name': activity.get('author_name'),
        'cc_project_name': activity.get('cc_project_name'),
        'name': activity.get('name')
    }
    activity_markup = template % data
    return index + activity_markup

def make_index_page(index):
    template = """
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>SmartGraphs</title>
            <style>
                body {
                    font-family: Helvetica, Arial, sans-serif;
                }

                .activity {
                    background-color: hsl(183, 40%, 95%);
                    color: hsl(34, 80%, 53%);
                    margin: 0.5em;
                    padding: 0.4em;
                }
                .info { font-size: 0.8rem; padding: 0.5em;}
            </style>
          </head>
          <body>
            %s
          </body>
        </html>
    """
    return template % index


index = ""

for activity in activities_data:
    write_activity_html(activity['activity'])
    index = add_activity_to_index(activity['activity'], index)
act_image_count = replaceRemoteImages("./static-website", imageBaseDir="./static-website")
print("repalced %s activity images" % act_image_count)

print index
index_html = make_index_page(index)
with codecs.open("static-website/index.html", "w",'utf-8') as dest:
    dest.write(unicode(index_html))
