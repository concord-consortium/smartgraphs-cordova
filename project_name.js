#!/usr/bin/env node

var fs = require("fs"),
    path = require('path'),
	parseString = require('xml2js').parseString,
	projectName = '';

function getProjectName(protoPath){
  var cordovaConfigPath = path.join(protoPath, 'config.xml'),
      xml = fs.readFileSync(cordovaConfigPath, 'utf-8');

  parseString(xml, function (err, result) {
    projectName = result.widget.name[0];
  });
  return projectName;
}

module.exports=getProjectName;
console.log(getProjectName("."));