var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var path = require('path');
var util = require('util');


var routes = require('./js/routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/busRTPI/:name', routes.bus);
app.get('/luasRTPI/:name', routes.luas);


//getting all the stop numbers and routes on a bus route
app.get('/route/:route/:direction', function(req,res){
    var direction = req.params.direction; //I for inbound, O for outbound
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
                var times = data.find('h2').text().split(" "); //counts results
                for(var i=1;i<times.length;i++) {
                    var stopNr = data.find('.result:nth-child('+i+') h2>span').text(); //stop nr
                    var stopName = data.find('.result:nth-child('+i+') a>span').text(); //stop name
                    stops.info.push({stopNr: stopNr, stopName: stopName});
                }
            })

        }
        res.send(JSON.stringify(stops,null,4));
    });


});


//getting all the bus routes

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
                var times = data.find('tr').length;
                for(var i=1;i<times;i++) {
                    var stopNr = data.find('tr:nth-child('+i+') td:nth-child(1) a').text();
                    var stopName = data.find('tr:nth-child('+i+') td:nth-child(2) a').text();
                    buses.busNo.push({route: stopNr, destination:stopName});
                }
            })

        }
        /*
         scraping this takes a while, so i suggest to run it only once in a while
         (routes doesnt really change, do they?)
         Like, bus numbers will be the same, wont they?
         For my example i am serving the one in /public/files/buses.json
         */
        fs.writeFile('output.json', JSON.stringify(buses, null, 4), function(err){

            console.log('File successfully written! - Check your project directory for the output.json file');

        });

        res.send(JSON.stringify(buses,null,4));
    });


});

app.get('/bus/:stopNo', function (req, res) {
    var stopNr = req.params.stopNo;
    /*
     here goes a fallback for stopNr, as it has to be 5 numbers
     */

    if(stopNr.length === 4) {
        stopNr = '0' + stopNr;
    }

    else if(stopNr.length === 3) {
        stopNr = '00' + stopNr;
    }

    else if(stopNr.length === 2) {
        stopNr = '000' + stopNr;
    }

    var url = 'http://rtpi.ie/Text/WebDisplay.aspx?stopRef=' + stopNr;

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var rtpi = {
                timeNow: "",
                bus: []

            };

            //getting time now from RTPI
            $('.titleLine').filter(function () {
                var data = $(this);
                timeNow = data.children().last().text(); //gets time from RTPI
                rtpi.timeNow = timeNow;

            });

            //getting last 10 buses
            $('#GridViewRTI').filter(function() {
                var data = $(this);
                var times = data.find('tr').length; //to see, how many buses ar show at the moment
                //console.log(times);
                for(i=2;i<times;i++) {
                    nextNo = data.find('tr:nth-child('+i+') td:nth-child(1)').text(); //next bus no
                    nextDest = data.find('tr:nth-child('+i+') td:nth-child(2)').text(); //next bus destination
                    nextTime = data.find('tr:nth-child('+i+') td:nth-child(3)').text(); //next bus due
                    rtpi.bus.push({busNo: nextNo, destination: nextDest, timeDue: nextTime});
                }

            });


        }
        res.send(JSON.stringify(rtpi,null,4));


    });
});


app.get('/luas/:stopName/:direction', function (req, res) {
    var stop = req.params.stopName;
    var IO = req.params.stopName;
    var stops = 'http://luasforecasts.rpa.ie/xml/get.ashx?encrypt=false&stop='+ stop + '&action=forecast';
    request(stops, function(error, response, xml){
        if (!error) {
            var $ = cheerio.load(xml);


            var luas = {
                inbound: [],
                outbound: []
            };

            $('stopInfo').filter(function() {
                var data = $(this);

                var first = data.children().next().children().attr();
                var second = data.children().next().children().children().attr();

                luas.inbound.push({first: first, second: second});

            });



            $('stopInfo').filter(function() {
                var data = $(this);

                var first = data.children().next().next().children().attr();
                var second = data.children().next().next().children().children().attr();

                luas.outbound.push({first: first, second: second});

            });
            res.send(luas);
        }
        /*
         scraping this takes a while, so i suggest to run it only once in a while
         (routes doesnt really change, do they?)
         Like, bus numbers will be the same, wont they?
         For my example i am serving the one in /public/files/buses.json
         */
        //fs.writeFile('output.json', JSON.stringify(buses, null, 4), function(err){
        //
        //    console.log('File successfully written! - Check your project directory for the output.json file');
        //
        //});

    });


});


app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;