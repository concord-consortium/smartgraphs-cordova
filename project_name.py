#!/usr/bin/env python
import xml.etree.ElementTree as ET

print(ET.parse('config.xml').find("{http://www.w3.org/ns/widgets}name").text)