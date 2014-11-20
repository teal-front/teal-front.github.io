var  mysqlClient = require('mysql');

var db={
    mysqlpool:{},
    release:function(con){
        con.end(function(error) {
            console.log('Connection closed');
        })
    },
    connect:function(config){
        this.mysqlpool = mysqlClient.createPool({
            host     : config.host,
            user     : config.user,
            password : config.password,
            port     : config.port||3306,
            database : config.database
        });
    },
    exec:function(options){
        this.mysqlpool.getConnection(function(error, connection){
            if(error) {
                console.log('DB-获取数据库连接异常！');
                throw error;
            }
            // 查询参数
            var sql = options.sql;
            var args = options.args;
            var handler = options.success;//回调方法
            // 执行查询
            if(!args) {
                var query = connection.query(sql, function(error, results) {
                    if(error) {
                        console.log('DB-执行查询语句异常！');
                        throw error;
                    }
                    // 处理结果
                    handler(results);
                });

            } else {
                var query = connection.query(sql, args, function(error, results) {
                    if(error) {
                        console.log('DB-执行查询语句异常！');
                        throw error;
                    }

                    // 处理结果
                    handler(results);
                });

            }
            // 返回连接池
            connection.release(function(error) {
                if(error) {
                    console.log('DB-关闭数据库连接异常！');
                    throw error;
                }
            });

        });
    }
};

module.exports=db;