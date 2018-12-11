var http = require('http');
var querystring = require('querystring');
var mysql  = require('mysql');
var url = require("url");
var path = require("path");
var express = require("express");
var app = express();

//  注册功能
app.post('/register', function (req, res) {
    console.log("我是注册功能");
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
                   res.send("用户已存在，注册失败");
                }else{
                    var connection1 = mysql.createConnection({
                        host     : 'localhost',
                        user     : 'root',
                        password : 'root',
                        port     : '3306',
                        database : 'mysql'
                    });


                    if(body.password == body.repassword){


                    connection1.connect();
                    var addsql = "insert into users(name,password) values(?,?)";
                    var params = [body.name,body.password];
                    connection1.query(addsql,params,function (err, result) {
                        if(err){
                            console.log('[INSERT ERROR] - ',err.message);
                            return;
                        }
                        res.send("注册成功(下一步跳转回登录界面)")
                    });

                    connection1.end();

                    }else{
                        res.send("两次输入的密码不一致，注册失败");
                    }}
            });

            connection.end();

        });
    };
})


// 登录功能
app.post('/load', function (req, res) {
    console.log("我是登录功能");
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

            var  sql = "SELECT * FROM users where name = '"+body.name+"' and password = '"+body.password+"'";
            //查询用户是否存在
            connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }
                if(result != ""){
                    res.send("登陆成功！(下一步跳转到用户网盘界面)")
                }else{
                    res.send("查无此用户！")
                }
            });

            connection.end();

        });
    };


})





//  /del_user 页面响应
app.get('/del_user', function (req, res) {
    console.log("/del_user 响应 DELETE 请求");
    res.send('删除页面');
})

//  /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
    console.log("/list_user GET 请求");
    res.send('用户列表页面');
})

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {
    console.log("/ab*cd GET 请求");
    res.send('正则匹配');
})


var server = app.listen(8088, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})