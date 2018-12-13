var http = require('http');
var querystring = require('querystring');
var mysql  = require('mysql');
var url = require("url");
var path = require("path");
var express = require("express");
var app = express();


var server = http.createServer();
    server.on("request",function (req,res) {
    var pathname = url.parse(req.url).pathname;
    console.log(pathname);
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
                password : '',
                port: '3306',
                database: 'Yun'
            });

            connection.connect();

            var sql = "select * from users where name = '"+body.name+"' and password = '"+body.password+"'";
            //查询用户是否存在
            connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }
                if(result != ""){
                    console.log("登陆成功！");
                  res.redirect( 302,'http://localhost:63342/SmallWhite/pan.html?_ijt=gme0bbq1pn9f7np1mmagvkhsnd');
                }else{
                    console.log("查无此用户！")
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
