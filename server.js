var http = require('http');
var querystring = require('querystring');
var mysql  = require('mysql');
var url = require("url");
var path = require("path");
var express = require("express");
var app = express();

//  注册功能
app.get('/register', function (req, res) {
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

            // 解析参数body将字符串改成对象
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

            var  sql = "select * from users where name = '"+body.name+"'";
            //查询用户是否存在
            connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }
                if(result != ""){
                   res.alert("用户已存在，注册失败");
                }else{
                    var connection1 = mysql.createConnection({
                      host     : 'localhost',
                      user     : 'root',
                      password : '',
                      port: '3306',
                      database: 'Yun'
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


                        res.redirect( 302,'http://localhost:63342/SmallWhite/netLoad.html?_ijt=hhtd8r8ncl4fo526k5fh0rht3e');
                    });

                    connection1.end();

                    }else{
                        res.send("两次输入的密码不一致，注册失败");
                    }}
            });
            connection.end();
        });
    }

});

// 登录功能
app.get('/load', function (req, res) {

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
              password : '',
              port: '3306',
              database: 'Yun'
            });

            connection.connect();

            var  sql = "select * from users where name = '"+body.name+"' and password = '"+body.password+"'";
            //查询用户是否存在
            connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }
                if(result != ""){
                    res.redirect( 302,'http://localhost:63342/SmallWhite/views/pan.html?_ijt=bsibdejnju2semikjktkp0uh16');
                }else{
                    res.send("查无此用户！")
                }
            });
            connection.end();
        });
    }
});
//配置模块
var setting = require("./setting");
var connection = mysql.createConnection(setting.db);
connection.connect();

app.get("/pan",function (req,res) {
  //查询
  var selectSql = "select * from list";
  var arr = [];
  connection.query(selectSql, function (err, rows) {
    if (err) {
    }
    for (var i = 0; i < rows.length; i++) {
      arr[i] = rows[i].name;
    }
    console.log(arr[i]);

    res.render('pan.jade', {
      title: '网盘',
      resource: {
        name: arr,
      }
    })
  })
  });

//开启服务器监听8088端口
var server = app.listen(8088, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});

