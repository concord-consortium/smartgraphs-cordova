#!/usr/bin/env python

import os
from shutil import copy
from sgutils import languages, projectName, mkdir_p
from glob import glob
project_name = projectName()

def cp(filename,outdir):
  print "copying %s to %s" % (filename, outdir)
  copy(filename, outdir)

for language in languages():
  # For splash screens
  outdir = "./platforms/ios/%s/Resources/splash/%s.lproj/" % (project_name, language)
  source_dir = "./res/screens/ios/%s.lproj/" % language
  mkdir_p(outdir)
  
  for filename in glob("%s*.png" % source_dir):
    cp(filename, outdir)
  
  # For strings:
  outdir = "./platforms/ios/%s/Resources/%s.lproj/" % (project_name, language)
  source_dir = "./res/%s.lproj/" % language
  mkdir_p(outdir)
  if language == 'en':
    # we don't put en in its own localized directory. 
    # confusing, but because of how localizing resources in Xcode works,
    # we have to go with this for now:
    outdir = "./platforms/ios/%s/Resources/" % (project_name)
  for filename in glob("%s*.strings" % source_dir):
    cp(filename, outdir)