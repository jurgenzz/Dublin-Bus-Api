var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var path = require('path');

var routes = require('./js/routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/stopNo/:name', routes.stopNo);
app.get('/dash/:name', routes.partials);

app.get('/route/:route/:direction', function(req,res){
    var direction = req.params.direction;
    var route = req.params.route;

    var routes = 'http://www.dublinbus.ie/en/DublinBus-Mobile/RTPI-Stops/?routeNumber='+ route + '&Direction=' + direction;
    request(routes, function(error, response, html){
        if (!error) {
            var $ = cheerio.load(html);

            var stops = {
                info: []
            };

            $('.results-box').filter(function() {
                var data = $(this);
                var times = data.find('h2').text().split(" ");
                console.log(times.length);
                for(var i=1;i<times.length;i++) {
                    var stopNr = data.find('.result:nth-child('+i+') h2>span').text();
                    var stopName = data.find('.result:nth-child('+i+') a>span').text();
                    stops.info.push([stopNr, stopName]);
                }
            })

        }
        res.send(JSON.stringify(stops,null,4));
    });


});

app.get('/stops', function (req, res) {
    var stops = 'http://www.dublinbus.ie/Your-Journey1/Timetables/';
    request(stops, function(error, response, html){
        if (!error) {
            var $ = cheerio.load(html);

            var buses = {
                busNo: []
                };

            $('.AspNet-GridView').filter(function() {
                var data = $(this);
                for(var i=1;i<131;i++) {
                    var stopNr = data.find('tr:nth-child('+i+') td:nth-child(1) a').text();
                    var stopName = data.find('tr:nth-child('+i+') td:nth-child(2) a').text();
                    buses.busNo.push([stopNr, stopName]);
                }
            })

        }
        res.send(JSON.stringify(buses,null,4));
    });


});

app.get('/bus/:stopNo', function (req, res) {
    var stopNr = req.params.stopNo;

    if(stopNr.length === 3) {
        stopNr = '00' + stopNr;
    }
    else if(stopNr.length === 4) {
        stopNr = '0' + stopNr;
    }
    else if(stopNr.length === 2) {
        stopNr = '000' + stopNr;
    }

    var url = 'http://rtpi.ie/Text/WebDisplay.aspx?stopRef=' + stopNr;

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var title, release, rating;
            var json = {
                timeNow: "",
                nextBus: []

            };

            //getting time now
            $('.titleLine').filter(function () {
                var data = $(this);
                timeNow = data.children().last().text();
                json.timeNow = timeNow;

            });

            //getting last 10 buses
            $('#GridViewRTI').filter(function() {
                var data = $(this);
                for(i=1;i<10;i++) {
                    nextNo = data.find('tr:nth-child('+i+') td:nth-child(1)').text();
                    nextDest = data.find('tr:nth-child('+i+') td:nth-child(2)').text();
                    nextTime = data.find('tr:nth-child('+i+') td:nth-child(3)').text();
                    json.nextBus.push([nextNo,nextDest,nextTime]);
                }

            });


        }
        res.send(JSON.stringify(json,null,4));



    });
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;