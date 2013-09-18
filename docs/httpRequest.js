var ignitionPt = [ 41 + 47 / 60 + 6.39/3600,- (8 + 8/60 + 26.43/3600)];

var U = 1;
var alpha= 135;
var std = 10;

bodyObj = {
  'ignitionPt': ignitionPt,
  'U': U,
  'alpha': alpha,
  'std': std
}


function runDemo (objName, Content) {
  
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  //xmlhttp.open('POST', MOUSE_TRACKER_SERVER + '/mouseTracker', true);
  xmlhttp.open('POST', 'http://localhost:8084/embersApi', true);
  // console.log('Connection open');

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState != 4 ) {
      console.log('not 4');
    }
    if (xmlhttp.status == 500) {
      console.log('500');
    }
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var content = JSON.parse(xmlhttp.responseText);
      console.log(content);
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