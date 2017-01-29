'use strict';

module.exports = function (app) {


    app.get('/', function (req, res) {
        // 视图上对象直接赋值
        res.locals.app = 'nodejs v4.3.2';
        res.locals.index = {
            names: [
                {name: 'teal', age: 16},
                {name: 'moegan', age: 18},
                {name: 'vivianpan', age: 32}
            ]
        };
        //debugger;
        console.log('index34');
        res.render('index');
    });

    app.use('/:directory/:action', function (req, res, next) {
        var directory = req.params.directory,
            action = req.params.action;

        /*var controller = require(`../controllers/${directory}`);
        controller[action](req, res);*/

        //res.render('change auto');
        res.render(`${directory}/${action}`);
        console.log(3);
        next();
    });

    // 注册中间件(middleware)，匹配路径时，此middleware才有用
    app.use('/my/:id.html', function (req, res, next) {
        var id = req.params.id;

        res.end(`${id}`);
        //next();
    });

    // use router
    app.use('/m', require('./home/index'));
};

