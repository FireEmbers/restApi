#!/usr/bin/env node
var express = require('express');
var app = express();
var printKml = require('./src/printKml');
var demoPrintKml = require('./src/demoPrintkml');
var credentials = require('./credentials');
var join = require('path').join;
var fullEmbers = require('embers');

var cors = require('cors');
app.use(cors());

var ngnsAPI = require('ngnsAPI');
var demoAPI = require('demoAPI');

app.configure(function(){
  app.use(express.bodyParser());
});

app.use('/outputs', express.static(__dirname + '/outputs/'));

//NGNS
app.post ('/embersNGNS', function (req, res){

  var id = Math.random()*100000;
  id = id.toFixed(0);

  console.log('req ' + id + ' @', Date());
  console.log('Running NGNS Embers...');
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

  res.setHeader('Content-Type', 'application/octet-stream');

  var id = Math.random()*100000;
  id = id.toFixed(0);

  console.log('\n>req ' + id + ' @', Date());

  if (!req.body) {
    return res.send(409, 'No content in body');
  }

  var opts = req.body;

  if (!opts.credentials) {
    opts.credentials = credentials;
  }

  var progressStream = fullEmbers(opts, onMaps);

  progressStream.on('data', function (d) {
    res.write(d);
  });

  function onMaps (err, kml){

    console.log('Done.');
    console.log('res ' + id + ' @', Date());

    if (err) {
      console.log(err);
      return res.send({reqId: null, err: err});
    } else {

      var outputPath = join(__dirname, 'outputs');

      //count kml size
      var maps = [];
      var countDown = Object.keys(kml).length-2;//minus time1 and time2 parameter
      var onKmlWrite = function  (err){

        if (err) {
          console.log(err);
          return res.send({reqId: null, err: err});
        }

        if (--countDown > 0 ) {
          return;
        }

        var mapsArr = [{
          'in': maps.kmlIn1,
          'out': maps.kmlOut1,
          'time': kml.time1
        },{
          'in': maps.kmlIn2,
          'out': maps.kmlOut2,
          'time': kml.time2
        }];

        var response = {reqId: id, maps: mapsArr, time: 60, err: null};
        return res.end(JSON.stringify(response), encoding = 'utf8');

      };

      for (var p in kml) {
        if (p === 'time1' || p === 'time2')
          continue;
        var filePath = 'output_'+ id + '-' + p +'.kml';
        printKml(kml[p], filePath, outputPath, onKmlWrite);
        maps[p] = filePath;
      }
    }
  }
});

var port = 8083;
app.listen(port, function () {
  console.log('Embers rest api listening in port:', port);
});