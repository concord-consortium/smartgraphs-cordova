import codecs
import os
import re

from tempfile import mkstemp
from shutil import move

def makeRelativeUrls():
  replace("./www/index.html", "/static", "static")
  for root, subs, files in os.walk("./www/static"):
    for f in files:
      if re.search('(.html)|(.css)', f):
        replace(os.path.join(root, f), "/static", getRelativeNameOfStatic(os.path.join(root, f))+"/static")

def getRelativeNameOfStatic(path):
  return os.path.relpath('./www/static', path)

def replace(source_file_path, pattern, substring):
    fh, target_file_path = mkstemp()

    with codecs.open(target_file_path, 'w', 'utf-8') as target_file:
        with codecs.open(source_file_path, 'r', 'utf-8') as source_file:
            for line in source_file:
                target_file.write(line.replace(pattern, substring))
    os.remove(source_file_path)
    move(target_file_path, source_file_path)
