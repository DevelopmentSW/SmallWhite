var http = require('http');
var querystring = require('querystring');
var mysql  = require('mysql');
var url = require("url");
var path = require("path");


var server = http.createServer();
server.on("request",function (req,res) {

    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });

    if(req.url!=="/favicon.ico"){
        req.on('data',function(data){
            console.log("服务器接收到的数据：　"+data);
        });

        req.on("end",function(){
            // 解析参数

            body = querystring.parse(body);

            // 设置响应头部信息及编码
            var connection = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : 'root',
                port: '3306',
                database: 'mysql'
            });

            connection.connect();

            var  sql = "SELECT * FROM users where name = '"+body.name+"'";
            //查询用户是否存在
            connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }
                if(result != ""){
                  res.write("用户已存在，注册失败");
                }else{
                    var connection1 = mysql.createConnection({
                        host     : 'localhost',
                        user     : 'root',
                        password : 'root',
                        port     : '3306',
                        database : 'mysql'
                    });

                    connection1.connect();
                    var addsql = "insert into users(name,password) values(?,?)";
                    var params = [body.name,body.password];
                    connection1.query(addsql,params,function (err, result) {
                        if(err){
                            console.log('[INSERT ERROR] - ',err.message);
                            return;
                        }
                        console.log("注册成功")
                    });

                    connection1.end();

                }
            });

            connection.end();

        });
    }

    res.end();


});

server.listen(8888,"localhost",function(){

    console.log("listened");

});
