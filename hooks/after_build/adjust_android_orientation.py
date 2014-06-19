#!/usr/bin/env python

import sys
import os
import re
import fileinput
import string

projectRoot = sys.argv[1]
projectPath = os.path.join(projectRoot, 'platforms', 'android')

if os.path.exists(projectPath):
  for file in os.listdir(projectPath):
    if re.search('AndroidManifest.xml', file):
      filepath = os.path.join(projectPath, file)
      print ("Setting Android device orientation on " + file);
      for line in fileinput.input(filepath, inplace = True):
        print string.replace(line, 'landscape', 'sensorLandscape'),
