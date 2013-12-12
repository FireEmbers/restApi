var fs = require('fs');
var join = require('path').join
module.exports = printKml;

function printKml (kml, id, outputPath, callback){

  fs.mkdir(outputPath, '0755', onDirCreate);

  function onDirCreate(err){

    writeFile('worstCase');
    writeFile('bestCase');
    writeFile('averageCase');

  }

  function writeFile(scenario){
    var filePath = join(outputPath, 'output_'+ id + '-' + scenario +'.kml');
    fs.writeFile(filePath, kml[scenario], {encoding:'utf8', mode: 0644}, onFileWrite);
  }

  var fileCounter = 3;
  function onFileWrite() {
    if (--fileCounter === 0) {
      callback();
    }
  }

};

