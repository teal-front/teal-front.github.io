module.exports = {
    index: function (req, res, next) {
        console.log('controller run');
    },
    demo1: function (req, res, next) {
        next();
    },
    demo2: function (req, res) {
        //next();
    }
};