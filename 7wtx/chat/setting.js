//全站配置文件
var config={
    domain:'',
    cookieSecret: '',
    redis:{
        port: '6379',
        host: '10.10.10.18'
    },
    'historyLen':10,
    mysql:{
        user:'7wtx_test',
        password:'7wtx_test7wtx_test',
        host:'10.10.10.18',
        database:'7wtx_test'
    },
    webhost:'http://www.7wtx.my/',
    'minLen' : 5,
    'maxLen' : 60
};

module.exports =config;