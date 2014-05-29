var tools={
    encodeJson:function(str){
        return encodeURIComponent(JSON.stringify(str).toString());
    },
    decodeJson:function(str){
        return JSON.parse(decodeURIComponent(str.toString()));
    },
    checkMsgLength:function(msg,config){
        var len = 0;
        var minLen = config.minlen ? config.minlen : 5;
        var maxLen = config.maxLen ? config.maxLen : 60;
        if(msg){
            len = msg.replace(/[^\x00-\xff]/g, '___').length;
        }
        if(len >= minLen && len <= maxLen){
            return true;
        }else{
            return false;
        }
    }
};

module.exports =tools;
