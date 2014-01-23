#!/usr/bin/env node
var express = require('express');
var app = express();
var printKml = require('./src/printKml');
var demoPrintKml = require('./src/demoPrintKml');
var join = require('path').join;

var cors = require('cors')
app.use(cors());

var ngnsAPI = require('ngnsAPI');
var demoAPI = require('demoAPI');
var fullEmbers = require('embers');

app.configure(function(){
  app.use(express.bodyParser());
});

app.use('/outputs', express.static(__dirname + '/outputs/'));

//NGNS
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

//Demo
app.post ('/runEmbers', function (req, res){
  var id = Math.random()*100000;
  id = id.toFixed(0);

  console.log('\n>req ' + id + ' @', Date());
  console.log('Running Embers demo...');

  if (!req.body)
    return res.send(409, 'No content in body');

  var opts = req.body;

  demoAPI(opts, function(err, kml, pathArrays){

    if (err) {
      console.log(err);
      console.log('Done.');
      console.log('res ' + id + ' @', Date());
      return res.send({reqId: null, err: err});
    } else {

      var outputPath = join(__dirname, 'outputs');
      demoPrintKml(kml, id, outputPath, function (err){

        if (err) {
          console.log(err);
          console.log('Done.');
          console.log('res ' + id + ' @', Date());
          return res.send({reqId: null, err: err});
        }

        console.log('Done.');
        console.log('res ' + id + ' @', Date());
        return res.send({reqId: id, err: null});
      });
    }
  });
});

//Full Stochastic Embers
app.post ('/fullEmbers', function (req, res){
  var id = Math.random()*100000;
  id = id.toFixed(0);

  console.log('\n>req ' + id + ' @', Date());
  console.log('Running Full Stochastic Embers...');

  if (!req.body) {
    return res.send(409, 'No content in body');
  }

  var opts = req.body;

  fullEmbers(opts, function(err, kml){

    if (err) {
      console.log(err);
      console.log('Done.');
      console.log('res ' + id + ' @', Date());
      return res.send({reqId: null, err: err});
    } else {

      var outputPath = join(__dirname, 'outputs');

      printKml(kml[mean1h], 'mean1h', id, outputPath, onKmlWrite);
      printKml(kml[mean2h], 'mean2h', id, outputPath, onKmlWrite);
      printKml(kml[icUp1h], 'icUp1h', id, outputPath, onKmlWrite);
      printKml(kml[icUp2h], 'icUp2h', id, outputPath, onKmlWrite);
      printKml(kml[icLo1h], 'icLo1h', id, outputPath, onKmlWrite);
      printKml(kml[icLo2h], 'icLo2h', id, outputPath, onKmlWrite);

      //count kml size
      var countDown = Object.keys(kml).length;
      function onKmlWrite(err){
        if (--countDown > 0 )
          continue;

        if (err) {
          console.log(err);
          console.log('Done.');
          console.log('res ' + id + ' @', Date());
          return res.send({reqId: null, err: err});
        }

        console.log('Done.');
        console.log('res ' + id + ' @', Date());
        return res.send({reqId: id, err: null});
      }

    }
  });
});

app.listen(8083);