'use strict';

module.exports = function (app) {
    // middleware
    app.all('*', function (req, res, next) {
        //res.writeHead(200, {'Cache-Control': 'max-age=30000'});
        //res.setRequestHeader('Cache-Control', 'max-age=30000');

    	console.log(`NODE_ENV: ${process.env.NODE_ENV}`);


        next();
    });
};