var Cache={
    cachename:'',
    cache:{},
    init:function(name,config){
        this.cachename=name;
        if(name='reids'){
            return this.redis(config);
        }
    },
    redis:function(config){
        this.redisClient = require("redis");
//        console.log(redisClient);
        this.client = this.redisClient.createClient(config.port, config.host);
        this.client.on("error",function(err){
            console.log("Redis Error " + err);
        });
//        client.on("connect", function () {
//            // start server();
//            client.set("name_key", "hello world", function (err, reply) {
//                console.log(reply.toString());
//            });
//
//            client.get("name_key", function (err, reply) {
//                console.log(reply.toString());
//            });
//        });
//        console.log(client);
        return this.client;
    }
};

module.exports =Cache;
