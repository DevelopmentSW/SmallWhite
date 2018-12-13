var express = require("express");
var app = express();

var mysql = require("mysql");
//配置模块
var setting = require("./setting");
//连接数据库
var connection = mysql.createConnection(setting.db);
connection.connect();

//查询
var selectSql = "select * from list";

var arr = [];
connection.query(selectSql,function (err,rows) {
  if (err){}
  for (var i = 0; i < rows.length; i++){
    arr[i] = rows[i].name;
  }

//把搜索值输出
  app.use('/', function(req, res) {
    res.send(arr);
  });

});
//关闭连接
connection.end();
app.listen(3000);
