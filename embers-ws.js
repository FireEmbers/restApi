#!/usr/bin/env node
var express = require('express');
var app = express();

var cors = require('cors')
app.use(cors());

var ngnsAPI = require('ngnsAPI');
var demoAPI = require('demoAPI');

app.configure(function(){
  app.use(express.bodyParser());
});

app.post ('/embersNGNS', function (req, res){

  var id = Math.random()*100000;
  id = id.toFixed(0);

  console.log('req ' + id + ' @', Date());
  console.log('Running NGNS Embers...')
  console.log(req.body);

  if (!req.body.content)
    return res.send(409, 'No content in body');

  var parameters = req.body.content;

  var ignitionPt = parameters.ignitionPt;
  var U = parameters.U;
  var alpha = parameters.alpha;

  ngnsAPI(ignitionPt, U, alpha, function(kml, ngnsOutput){
    res.send(ngnsOutput);
    console.log('res ' + id + ' @', Date());
  });
});

app.post ('/runEmbers', function (req, res){
  var id = Math.random()*100000;
  id = id.toFixed(0);

  console.log('req ' + id + ' @', Date());
  console.log('Running Embers...');

  if (!req.body)
    return res.send(409, 'No content in body');

  var opts = req.body;

  demoAPI(opts, function(err, kml, pathArrays){
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.send(pathArrays);
    console.log('Done.');
    console.log('res ' + id + ' @', Date());
  });

});

app.listen(8083); 