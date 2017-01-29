'use strict';

module.exports = function (req, res, next) {
    res.locals = res.locals || {};

    let rawRender = res.render;
    res.render = function (path, data, opts) {
        data = Object.assign({}, res.locals, data);

        rawRender.apply(this, [path, data, opts]);
    };

    next();
};