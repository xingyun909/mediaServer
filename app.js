'use strict'

var fs = require('fs')
var path =require('path')
var mongoose =require('mongoose')
var db = 'mongodb://localhost:13380/demo'

mongoose.Promise = require('bluebird')
mongoose.connect(db)

/****
* 引入所有的模型文件
*	两种 
* 	1：require()每个模型文件
*	2： 方法遍历。引入多个模型文件
***/
var models_path = path.join(__dirname,'/app/models')//设置模型文件初始路径

var  walk = function (modlePath) {
	fs.readdirSync(modlePath)//获取所有文件
	.forEach(function (file) { //遍历文件
		var filePath = path.join(modlePath,'/'+file);//拼接完整路径
		var stat = fs.statSync(filePath)

		if(stat.isFile()){
			if(/(.*)\.(js|coffee)/.test(file)){
				require(filePath)
			}
		}else if(stat.isDirectory()){
			walk(filePath)
		}
	})
}

walk(models_path)
//

var koa = require('koa')
var logger = require('koa-logger')
var session = require('koa-session')
var bodyparser = require('koa-bodyparser')

var app = koa()

app.keys = ['media']
app.use(logger())
app.use(session(app))
app.use(bodyparser())

var router = require('./config/routes')()

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(1233)
console.log('Listening 1233')