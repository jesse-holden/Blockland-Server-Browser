/**
 * Created by Jesse on 4/9/2017.
 */
// Require mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ServerSchema = new Schema({
  ip: {
    type: String
  },
  port: {
    type: Number
  },
  passworded: {
    type: Boolean
  },
  dedicated: {
    type: Boolean
  },
  servername: {
    type: String
  },
  players: {
    type: Number
  },
  maxplayers: {
    type: Number
  },
  brickcount: {
    type: Number
  }
});

var Server = mongoose.model("Server", ServerSchema);

module.exports = Server;
