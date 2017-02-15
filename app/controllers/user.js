'use strict'

var xss = require('xss')
var mongoose = require('mongoose')
var User = mongoose.model('User')

exports.signup = function * (next) {
    // var phoneNumber = this.request.body.phoneNumber
    var phoneNumber = this.query.phoneNumber


    var user = yield User
        .findOne({phoneNumber: phoneNumber})
        .exec() //调用exec使其promise

    if (!user) { //用户不存在加入用户 ，存在添加验证码，
        user = new User({phoneNumber: xss(phoneNumber)})
    } else {
        user.verifyCode = '21432'   //验证码动态生成
    }

    console.log(user)

    try {
        user = yield user.save()
    } catch (e) {
        console.log(e) 
        console.log('wrong') 
        this.body = {
            success: false
        }
        return
    }
    console.log(user)

    this.body = {
        success: true
    }
    console.log('signup over')

}

exports.verify = function * (next) {
    this.body = {
        success: true
    }
}

exports.update = function * (next) {
    this.body = {
        success: true
    }
}
