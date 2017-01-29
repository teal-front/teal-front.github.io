'use strict';

global.ROOT = __dirname;
global.ROOT_M = '../H5';

var path = require('path');
var express = require('express'),
    bodyParse = require('body-parser'),
    cookieParse = require('cookie-parser');
var app = express();
var routes = require('./routes');
var config = require('./config');

const H5_VIEW_PATH = `${global.ROOT_M}/views`;
const H5_ROUTE_PATH = `${global.ROOT_M}/routes/index`;

app.locals.global_vars = 'app_global_vars';

app.set('views', path.join(__dirname, H5_VIEW_PATH));
app.set('view engine', 'ejs');
//debugger;
//app.use(express.static(__dirname + '/public'));

// middleware
app.use(require('./middlewares/attach-function'));

// routes
routes(app);
require(H5_ROUTE_PATH)(app);
console.log('app.js');
app.listen(8899);

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);