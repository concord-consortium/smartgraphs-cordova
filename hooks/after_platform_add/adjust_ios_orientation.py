#!/usr/bin/env python

import sys
import os
import re
import fileinput

projectRoot = sys.argv[1]
projectPath = os.path.join(projectRoot, 'platforms', 'ios')

if os.path.exists(projectPath):
  for folder in os.walk(projectPath).next()[1]:
    for file in os.listdir(os.path.join(projectPath, folder)):
      if re.search('.plist', file):
        filepath = os.path.join(projectPath, folder, file)
        print ("Setting iOS device orientation on " + file);
        for line in fileinput.input(filepath, inplace = True):
          if not re.search(r'UIInterfaceOrientationPortrait', line):
            print line,
