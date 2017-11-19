var express = require('express')
    , Server = require("../models/Server.js")
    , Library = require("../models/Library.js")
    , router = express.Router()
    , request = require('request')
// This is the URL we fetch the server list from
    , request_url = "http://master2.blockland.us"
    , responseObject = {}
    , res_output = "FAILED"
    , stale_age = 10
    , responseTime = new Date();

//Response Class
function Response(status, array) {
    this.status = status;
    this.cached = Boolean;
    this.response_time = Number;
    this.servercount = 0;
    this.servers = array;
}

/* GET home page. */
router.get('/', function (req, res, next) {
    responseTime = new Date();
    Library.find({}, {timestamp: 1}, function (error, doc) {
        verAge = Math.ceil((new Date() - doc[0].timestamp) / 1000);
        // Check if stored data is stale
        if (verAge >= stale_age) {
            request(request_url, function (error, response, html) {
                if (!error && response.statusCode === 200) {
                    responseObject = {};
                    serverArray = [];
                    lines = html.split('\r\n');
                    if (lines[1] === "START" && lines[lines.length - 3] === "END") {
                        for (var i = 2; i < lines.length - 3; i++) {
                            serverProperties = lines[i].split('\t');
                            serverArray[serverArray.length] = new Server({
                                ip: serverProperties[0],
                                port: serverProperties[1],
                                passworded: (serverProperties[2] === "1"),
                                dedicated: (serverProperties[3] === "1"),
                                servername: serverProperties[4],
                                players: serverProperties[5],
                                maxplayers: serverProperties[6],
                                mapname: serverProperties[7],
                                brickcount: serverProperties[8]
                            });
                        }
                        responseObject = new Response("ok", serverArray);
                        responseObject.cached = false;
                        responseObject.response_time = new Date() - responseTime;
                        responseObject.servercount = serverArray.length;
                        res_output = JSON.stringify(responseObject);
                        console.log('API requested. Response: ' + responseObject.status);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(res_output);
                        responseTime = new Date();
                        Library.update({}, {
                            timestamp: new Date(),
                            servers: serverArray
                        }, function (error, affected, resp) {
                            if (error) {
                                console.log(error);
                            }
                        });

                    } else {
                        responseObject = new Response("error");
                        responseObject.message = {code: "SERVER_LIST_NOT_FOUND", hostname: request_url};
                        res_output = JSON.stringify(responseObject);
                        console.log('API requested. Response: ' + responseObject.status);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(res_output);
                    }
                } else {
                    responseObject = new Response("error");
                    responseObject.message = error;
                    res_output = JSON.stringify(responseObject);
                    console.log('API requested. Response: ' + responseObject.status);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(res_output);
                }
            });
            // Load stored information instead
        } else {
            Library.find({}, {servers: 1}).exec(function (error, doc) {
                serverArray = doc[0].servers;
                responseObject = new Response("ok", serverArray);
                responseObject.cached = true;
                responseObject.response_time = new Date() - responseTime;
                responseObject.servercount = serverArray.length;
                res_output = JSON.stringify(responseObject);
                console.log('API requested. Response: ' + responseObject.status);
                res.setHeader('Content-Type', 'application/json');
                res.end(res_output);
            });
        }
    });

});

module.exports = router;