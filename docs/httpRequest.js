var ignitionPt = [ 41 + 47 / 60 + 6.39/3600,- (8 + 8/60 + 26.43/3600)];

var U = 1;
var alpha= 135;

bodyObj = {
  'ignitionPt': ignitionPt,
  'U': U,
  'alpha': alpha
}

var baelish = 'http://demo.crowdprocess.com/embersNGNS';

var content = {};

function runDemo (objName, Content) {
  
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  xmlhttp.open('POST', baelish, true);
  //xmlhttp.open('POST', 'http://localhost:8084/embersApi', true);
  // console.log('Connection open');

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      content = JSON.parse(xmlhttp.responseText);
      console.log('content:', content);
    }
  }


  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  var requestData = {
    name : objName,
    content : Content
  };
  var postContent = JSON.stringify(requestData);
  xmlhttp.send(postContent);
  // console.log('Data sent');
  
}

runDemo('parameters', bodyObj );  
