var express = require('express'),
    app = express(),
    server = require('http').createServer(app),     //创建服务器
    io = require('socket.io').listen(server),       //socket监听服务器
    config=require('./setting'),                //载入配置文件
    ejs=require('ejs'),
    cache= require('./module/Cache').init('redis',config.redis), //redis
    tools=require('./module/tools'), //常用工具方法对象
    User=require('./module/User');

app.use('/www',express.static(__dirname + '/www'));   //设置静态目录
//app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
app.use(express.cookieParser('123'));
ejs.open='{{';
ejs.close='}}';

app.set('view engine', 'html');
app.engine('.html', ejs.__express);
app.set('views', __dirname + '/view');             //模版路径
app.use(app.router);                                //启用路由

server.listen(process.env.PORT || 4000);

app.get("/dialog/:uid/:sign",User.authorize,function(req,res){
    var uid=req.params.uid,sign=req.params.sign;
    User.getUserInfo(uid,function(userinfo){
        if(userinfo[0]){
            User.getUserHonor(uid,function(honor){
                User.getLastHonor(uid,function(lasthonor){
                    res.render("dialogtest",{
                            'userinfo':userinfo[0],
                            'honor':honor[0],
                            'lasthonor':lasthonor[0]
                            }
                    );
                });
            });
        }else{
            res.redirect(config.webhost);
        }
    });
});
//一个客户端连接的字典，当一个客户端连接到服务器时，
//会产生一个唯一的socketId，该字典保存socketId到用户信息（昵称等）的映射
var connectionList = {};

//存放频道消息的数据对象
var dataPool = {};

var onlineNum = 0;
var isverify=0;

io.sockets.on('connection', function(socket) {
    console.log('\033[96m'+"Connection " + socket.id + " accepted."+'\033[39m \n');
    //定时的系统广播
    setTimeout(function(){
        socket.emit('notice',{notice:"这是重要的系统广播，这是重要的系统广播，这是重要的系统广播"},"worldchannel");
    },5000);

    //历史消息
    socket.on('historychat',function(){
        var history=[];
        cache.lrange("dialog:broadcast:history",0,config.historyLen-1,function(err,replay){
            var len=replay.length;
            for(var i=0;i<len;i++){
                history[len-1-i]=JSON.parse(replay[i]);
            }
            socket.emit('sendhistorychat',history,"worldchannel");
        });
    });

    //在线人数
    socket.on('getOnlineNum', function(){
        io.sockets.emit('onlineNum',++onlineNum);//向所有连接到服务器的客户端发送在线人数（"sockets"这里的有个"s"）
    });

    //socket验证
    socket.on('userVerification',function(msg,curC){
//        User.userVerify(msg.)
//        socket.disconnect();
        isverify=1;
        console.log(msg);
    });

    //接收用户发送的消息，然后广播这条消息
    socket.on('postMsg', function(msg,curC) {
        //消息验证
        if(isverify==0){
            io.sockets.emit('errMsg','用户验证失败，请重新登录');
            return false;
        }
        if(!tools.checkMsgLength(msg.msg,config)){
            io.sockets.emit('errMsg','请输入5-60个字符');
        }else{
        //将消息放入消息队列
        //判断队列长度
        cache.llen("dialog:broadcast:history",function(err,reply){
            if(parseInt(reply)>=config.historyLen){
                cache.ltrim("dialog:broadcast:history",0,config.historyLen-1);
            }
        });
        cache.lpush("dialog:broadcast:history", JSON.stringify(msg), function (err, reply) {
//                console.log(reply.toString());
        });
        socket.broadcast.emit('newMsg',msg,curC);
        }
    });

    socket.on('disconnect', function(){
        console.log('\033[96m'+"Connection " + socket.id + " terminated."+'\033[39m \n');
    });
});

