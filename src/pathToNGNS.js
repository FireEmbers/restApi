module.exports = function pathToNGNS(path){

  var outputString = '';

  var currentPath = path['averageCase'];
  for (var i = 0; i < currentPath.length -1; i++)
    outputString += currentPath[i][0] + ',' + currentPath[i][1] + ';' ;

  outputString += currentPath[currentPath.length -1][0] + ',' + currentPath[currentPath.length -1][1];


  outputString += '|';

  var currentPath = path['bestCase'];
  for (var i = 0; i < currentPath.length -1 ; i++)
    outputString += currentPath[i][0] + ',' + currentPath[i][1] + ';' ;

  outputString += currentPath[currentPath.length -1][0] + ',' + currentPath[currentPath.length -1][1];

  outputString += '|';

  var currentPath = path['worstCase'];
  for (var i = 0; i < currentPath.length -1; i++)
    outputString += currentPath[i][0] + ',' + currentPath[i][1] + ';' ;

  outputString += currentPath[currentPath.length -1][0] + ',' + currentPath[currentPath.length -1][1];

  return outputString;
};