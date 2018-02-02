#!/usr/bin/env node

var fs = require('fs');
var sourceMap = require('source-map');
var exec = require('child_process').exec; 

var jsFile = process.argv[2];
var mapFile = `${jsFile}.map`;
var outputDir = "output";

var jsFileData = fs.readFileSync(jsFile, 'utf8');
var mapInstance = new sourceMap.SourceMapConsumer(fs.readFileSync(mapFile, 'utf8'));
mapInstance.then(function(map) {
  for (var i = 0; i < map.sources.length; i++) {
    var payloadUrl = map.sources[i];
    var fileName = payloadUrl.replace(/_/g, '/').replace(/~/g, 'node_modules');
    fileName = fileName.substring(fileName.indexOf('///') + 3);
    fileName = `./${outputDir}/${fileName}`;;
    var dirName = fileName.substring(0, fileName.lastIndexOf("/")+1);
    writeFile(dirName, fileName, map.sourceContentFor(payloadUrl));
  }
});

function writeFile (dirName, fileName, contents){
  var command = "mkdir -p '" + dirName + "'";   
  console.log(`Info: Creating Directory:  ${dirName}`);  
  exec(command, {}, function(error, stdout, error){
    if (error) {
      console.error("Error : ", error);
      return;
    }
    console.log(`Info: Writing: ${fileName}`);
    fs.writeFileSync(fileName, contents, 'utf8', 0o644);
  });
}