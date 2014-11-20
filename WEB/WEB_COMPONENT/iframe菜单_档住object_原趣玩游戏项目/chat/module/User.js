var crypto = require('crypto'),
    config=require('../setting'),
    db=require('./mysql');
db.connect(config.mysql);
var User={
    //登录验证
    authorize:function(req,res,next){
        var md5 = crypto.createHash('md5');
        if(req.cookies['7wtx-access']){
            var hash=md5.update(req.params.uid+req.cookies['7wtx-access']).digest('hex');
            if(hash.toLowerCase()==req.params.sign.toLowerCase()){
                next();
            }else{
                next();

            }
        }else{
//            res.redirect('/');
            next();
        }
    },
    userVerify:function(uid,access,sign){
        var hash=md5.update(uid+access).digest('hex');
        if(hash==sign){
            return 0;
        }else{
            return 1;
        }
    },
    getUserInfo:function(uid,handler){//获取用户信息

        db.exec({
            sql:'select a.*,b.vaipstauts from game_user a left join game_vip b on b.uid=a.suid where a.suid='+uid+' limit 1',
            success:function(res){
                handler(res);
            }
        });
    },
    getUserHonor:function(uid,handler){//获取用户成就值
        db.exec({
            sql:'select SUM(hovalue) as v from game_honorlog where suid='+uid+' limit 1',
            success:function(res){
                handler(res);
            }
        });
    },
    getLastHonor:function(uid,handler){//获取最新成就
        db.exec({
            sql:'select b.* from game_honorlog a left join game_honor b on a.honorid=b.id where a.suid='+uid+' order by hoaddtime desc limit 1',
            success:function(res){
                handler(res);
            }
        });
    }
};
module.exports=User;