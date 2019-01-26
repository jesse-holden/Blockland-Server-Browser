/**
 * Created by Jesse on 4/9/2017.
 */
var express = require("express"),
  router = express.Router(),
  request = require("request"),
  playerCount = 0,
  serverList = [];

function sortByPlayers(a, b) {
  return b.players - a.players;
}

function getPlayerCount(server_array) {
  let i = 0;
  server_array.forEach(server => {
    i += server.players;
  });
  return i;
}

/* GET serverlist page. */
router.get("/", function(req, res, next) {
  request("http://" + req.headers.host + "/api", function(
    error,
    response,
    html
  ) {
    if (!error && response.statusCode === 200) {
      statusJSON = JSON.parse(html).status;
      if (statusJSON === "ok") {
        serverList = [];
        serversJSON = JSON.parse(html).servers;
        serversJSON.forEach(function(server) {
          serverList[serverList.length] = server;
        });
        playerCount = getPlayerCount(serverList);
        serverList = serverList.sort(sortByPlayers);
        res.render("serverlist", {
          title: "Blockland Server List",
          content: serverList,
          playerCount: playerCount
        });
      } else if (statusJSON === "error") {
        var errorMessage = JSON.parse(html).message;
        res.render("serverlist", {
          title: "Blockland Server List",
          errorMessage: errorMessage
        });
      }
    } else {
      res.end("Error: " + error);
    }
  });
});

module.exports = router;
