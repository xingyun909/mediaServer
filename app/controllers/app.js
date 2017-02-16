'use strict'

var mongoose = require('mongoose')
var User = mongoose.model('User')

exports.signature = function * (next) {
  this.body = {
    success: true
  }
}

exports.hasBody = function * (next) {
  var body = this.request.body || {}
  if (Object.keys(body).length === 0) {
    this.body = {
      success: false,
      error: '遗漏参数了'
    }
    return next
  }
  yield next
}
exports.hasToken = function * (next) {
  var accessToken = this.query.accessToken

  if (!accessToken) {
    accessToken = this.request.body.accessToken
  }

  if (!accessToken) {
    this.body = {
      success: false,
      error: 'do not have accessToken'
    }

  }

  //查询用户表是否有此用户

  var user = yield User
    .findOne({accessToken: accessToken})
    .exec()

  if (!user) {

    this.body = {
      success: false,
      error: '用户没登录'
    }
    return next
  }

  this.session = this.session || {}
  this.session.user = user

  yield next
}
