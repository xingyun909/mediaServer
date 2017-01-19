'use strict'

var koa = require('koa');
var logger = require('koa-logger');
var session = require('koa-session');
var bodyparser = require('koa-bodyparser');

var app = koa();

app.keys = ['media'];
app.use(logger());
app.use(session(app));
app.use(bodyparser());

var router = require('./config/routes')()

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(1233)
console.log('Listening 1233')