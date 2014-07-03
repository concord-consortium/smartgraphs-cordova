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

def copyHtmlTemplate(sg_buildnumber=os.getenv('SG_BUILD_NUMBER', 'export_sg_buildnumber')):
    with codecs.open("./www/index.html", 'w', 'utf-8') as target_file:
        with codecs.open("./www/index_template.html", 'r', 'utf-8') as source_file:
            for line in source_file:
                target_file.write(line.replace('$SG_BUILD_NUMBER', sg_buildnumber))


def cacheImage(url,i, path='www'):
   cacheDir = os.path.join(path,'images')
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
  act_image_count = replaceRemoteImages("./www/static/smartgraphs")
  print("repalced %s activity images" % (act_image_count))
  final_count = replaceRemoteImages("./www/menu",act_image_count)
  menu_count = final_count - act_image_count
  print("repalced %s menu images" % (menu_count))
  print("repalced %s a total of images" % (final_count))

def replaceRemoteImages(path,start_count=0):
    # http://rubular.com/r/9MUmX39uZB
    image_count = start_count
    image_regex = "(https?:\/\/[^'\"]+\.(?:gif|jpg|png|svg))"
    regex = re.compile(image_regex,re.IGNORECASE | re.MULTILINE)
    for root, subs, files in os.walk(path):
        for f in files:
            if re.search('\.(js|html)', f):
                with open(os.path.join(root,f),'r') as source:
                    data = source.read()
                imageUrls = regex.findall(data)
                imageDict = dict.fromkeys(imageUrls)
                for url in imageDict.iterkeys():
                    image_count = image_count + 1
                    imageDict[url] = cacheImage(url,image_count, path)
                    data = data.replace(url,imageDict[url])
                newfile = os.path.join(root,f)
                with open(newfile,'w') as dest:
                    dest.write(data)
    return image_count