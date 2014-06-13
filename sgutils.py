import codecs
import os
import re
import urllib
from tempfile import mkstemp
from shutil import move

def makeRelativeUrls():
  replace("./www/index.html", "/static", "static")
  for root, subs, files in os.walk("./www/static"):
    for f in files:
      if re.search('(.html)|(.css)', f):
        replace(os.path.join(root, f), "/static", getRelativeNameOfStatic(os.path.join(root, f))+"/static")
  replaceActivityImages()

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

def copyHtmlTemplate(sg_buildnumber):
    with codecs.open("./www/index.html", 'w', 'utf-8') as target_file:
        with codecs.open("./www/index_template.html", 'r', 'utf-8') as source_file:
            for line in source_file:
                target_file.write(line.replace('$SG_BUILD_NUMBER', sg_buildnumber))


def cacheImage(url,i):
   cacheDir = os.path.join('www','images')
   if not os.path.exists(cacheDir):
       os.makedirs(cacheDir)
   regex = re.compile('[^\.]\.(gif|jpg|png|svg)', re.IGNORECASE)
   match = regex.search(url)
   if match:
       extension = match.group(match.lastindex)
   else:
       extension = ".error"
   filename = "%s.%s"%(i,extension.lower())
   urllib.urlretrieve(url,os.path.join(cacheDir,filename))
   newUrl = "images/%s"%(filename)
   return newUrl

def replaceActivityImages():
    # http://rubular.com/r/9MUmX39uZB
    image_regex = "(https?:\/\/[^'\"]+\.(?:gif|jpg|png|svg))"
    regex = re.compile(image_regex,re.IGNORECASE | re.MULTILINE)
    image_count = 0
    for root, subs, files in os.walk("./www/static/smartgraphs"):
        for f in files:
            if re.search('javascript-packed.js', f):
                with open(os.path.join(root,f),'r') as source:
                    data = source.read()
                imageUrls = regex.findall(data)
                imageDict = dict.fromkeys(imageUrls)
                for url in imageDict.iterkeys():
                    image_count = image_count + 1
                    imageDict[url] = cacheImage(url,image_count)
                    data = data.replace(url,imageDict[url])
                newfile = os.path.join(root,f)
                with open(newfile,'w') as dest:
                    dest.write(data)
