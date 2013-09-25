var express = require('express');
var app = express();

var cors = require('cors')
app.use(cors());

var demoApi = require('demoAPI');

app.configure(function(){
  app.use(express.bodyParser());
});

app.post ('/embersApi', function (req, res){

  var id = Math.random()*100000;
  id = id.toFixed(0);

  console.log('req ' + id + ' @', Date());
  console.log(req.body);

  if (!req.body.content)
    return res.send(409, 'No content in body');

  var parameters = req.body.content;

  var ignitionPt = parameters.ignitionPt;
  var U = parameters.U;
  var std = 10; //quick fix
  var alpha = parameters.alpha;

  demoApi(ignitionPt, U, std, alpha, function(kml, paths){
    res.send(paths);
    console.log('res ' + id + ' @', Date());
  });


});

app.listen(8083);
