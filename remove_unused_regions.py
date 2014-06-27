#!/usr/bin/env python

import sys
import os
import fileinput
import glob
import shutil

###########################################################################
# This script *DOES NOT* remove the references in the IOS XCode project.
# It should, but I haven't found a simple way to do that yet.  When it does
# We could should move it to hooks/after_build/
# 
# usage ./remove_usused_regions.py `pwd`
###########################################################################

projectRoot   = sys.argv[1]
keepLangs     = ['en.lproj']
resourceDir   = os.path.join(projectRoot, 'platforms', 'ios', 'African Lions', 'Resources')
globPattern   = os.path.join(resourceDir, "*.lproj")
foundsome     = False

if os.path.exists(resourceDir):
	removeFiles = glob.glob(globPattern)
  	for f in removeFiles:
  		if os.path.basename(f) not in keepLangs:
  			print("Remove resource file %s" % f)
  			foundsome = True
  			shutil.rmtree(f)

else:
	print("Failure: Resource directory %s is non existant" % resourceDir)

if foundsome:
	print("************************************************************")
	print("Now you must manually open the xcode project and remove     ")
	print("unwanted files from the project browser in resources/*.lproj")
	print("************************************************************")

else:
	print("No extra language files found")
