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
    console.log(stopNr);

    url = 'http://rtpi.ie/Text/WebDisplay.aspx?stopRef=' + stopNr;

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
            //$('#GridViewRTI').filter(function() {
            //    var data = $(this);
            //    for(i=1;i<10;i++) {
            //
            //        json.nextBus.destination.push(nextBus);
            //    }
            //});
            //$('#GridViewRTI').filter(function() {
            //    var data = $(this);
            //    for(i=1;i<10;i++) {
            //
            //        json.nextBus.time.push(nextBus);
            //    }
            //
            //})

        }
        res.send(JSON.stringify(json,null,4));

        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function

        //fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        //
        //    console.log('File successfully written! - Check your project directory for the output.json file');
        //
        //})

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.


    });
})

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;