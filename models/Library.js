/**
 * Created by Jesse on 4/9/2017.
 */
// Require mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LibrarySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    servers: {
        type: Array
    },
    timestamp: {
        type: Date,
        default: 0
    }
});

var Library = mongoose.model("Library", LibrarySchema);

module.exports = Library;