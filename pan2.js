var express = require("express");
var app=express();
var path = require('path');

//设置模板引擎

app.set("view engine","jade");
//app.set('view','./views/')

//设置静态资源
app.use(express.static(path.join(__dirname,'./public')));

//访问网站根目录:localhost:
app.get("/",function (req,res) {
  res.render('pan.jade',{

  })
});

