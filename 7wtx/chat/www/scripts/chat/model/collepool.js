;define(function(require,exports,module){
    var chatCollection = require('./chatcollection');

    var collPoll = {
        colle:{
            worldchannel:new chatCollection(),
            syschannel:new chatCollection
        },
        createColle:function(){
            return new chatCollection();
        }
    }

    module.exports = collPoll;
})
