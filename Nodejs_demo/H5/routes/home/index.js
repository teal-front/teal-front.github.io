'use strict';

var express = require('express');
var router = express.Router();

router.get('/command/get/:id', [function (req, res, next) {
    console.log(req.session);
    console.log(req.url);
    next();
}, function (req, res, next) {
    let id = req.params.id;

    res.end(`${id}`);
}]);
router.get('/channel/top-up/:id/:username', function (req, res, next) {
    let id = req.params.id, username = req.params.username;

    res.end(`${id}${username}`)
});

module.exports = router;