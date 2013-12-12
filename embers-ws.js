#!/usr/bin/env node
var express = require('express');
var app = express();
var printKml = require('./src/printKml');
var join = require('path').join;

var cors = require('cors')
app.use(cors());

var ngnsAPI = require('ngnsAPI');
var demoAPI = require('demoAPI');

app.configure(function(){
  app.use(express.bodyParser());
});

app.use('/outputs', express.static(__dirname + '/outputs/'));

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

  console.log('\n>req ' + id + ' @', Date());
  console.log('Running Embers...');

  if (!req.body)
    return res.send(409, 'No content in body');

  var opts = req.body;

  demoAPI(opts, function(err, kml, pathArrays){
    if (err) {
      console.log(err);
      res.send(err);
    }

    var outputPath = join(__dirname, 'outputs');
    printKml(kml, id, outputPath, function (){
      
      res.send({reqId: id});
      console.log('Done.');
      console.log('res ' + id + ' @', Date());
    });
  });
});

app.listen(8083);