var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Blockland Server List', content: "<a href=\"/serverlist\">Server List</a>"});
});

module.exports = router;
