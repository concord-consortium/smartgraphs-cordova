#!/usr/bin/env node

var IOS_DEPLOYMENT_TARGET = '7.1',
    IOS_TARGETED_DEVICE   = '2';        // iPad

var fs = require("fs"),
    path = require("path"),
    shell = require("shelljs"),
    xcode = require('xcode'),
    parseString = require('xml2js').parseString,
    projectRoot = process.argv[2],
    projectName = '';

function propReplace(obj, prop, value) {
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (typeof obj[p] === 'object') {
        propReplace(obj[p], prop, value);
      } else if (p === prop) {
        obj[p] = value;
      }
    }
  }
}

function updateDeploymentTarget(xcodeProject, xcodeProjectPath, targetVersion){
  var buildConfig = xcodeProject.pbxXCBuildConfigurationSection();
  propReplace(buildConfig, 'IPHONEOS_DEPLOYMENT_TARGET', targetVersion);
  fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync(), 'utf-8');
}

function updateDeploymentDevice(xcodeProject, xcodeProjectPath, targetVersion){
  var buildConfig = xcodeProject.pbxXCBuildConfigurationSection();
  propReplace(buildConfig, 'TARGETED_DEVICE_FAMILY', targetVersion);
  fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync(), 'utf-8');
}

function getProjectName(protoPath){
  var cordovaConfigPath = path.join(protoPath, 'config.xml'),
      xml = fs.readFileSync(cordovaConfigPath, 'utf-8');

  parseString(xml, function (err, result) {
    projectName = result.widget.name[0];
  });
}

function run(projectRoot){

  getProjectName(projectRoot);

  var xcodeProjectName = projectName + '.xcodeproj',
      xcodeProjectPath = path.join(projectRoot, 'platforms', 'ios', xcodeProjectName, 'project.pbxproj'),
      xcodeProject;

  if(!fs.existsSync(xcodeProjectPath)) { return; }

  xcodeProject = xcode.project(xcodeProjectPath);

  shell.echo("Adjusting iOS deployment target for " + projectName);

  xcodeProject.parse(function(err){
    if(err){
      shell.echo('An error occured during parsing of [' + xcodeProjectPath + ']: ' + JSON.stringify(err));
    }else{
      updateDeploymentTarget(xcodeProject, xcodeProjectPath, IOS_DEPLOYMENT_TARGET);
      shell.echo(xcodeProjectPath + ' now has deployment target set as:[' + IOS_DEPLOYMENT_TARGET + '] ...');
      updateDeploymentDevice(xcodeProject, xcodeProjectPath, IOS_TARGETED_DEVICE);
      shell.echo(xcodeProjectPath + ' now has targeted device set as:[' + IOS_TARGETED_DEVICE + '] ...');
    }
  });
}

run(projectRoot);
