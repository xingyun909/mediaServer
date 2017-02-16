'use strict'

var xss = require('xss')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var uuid = require('uuid')
var sms = require('../service/sms')

/***
 * 注册用户
 */
exports.signup = function * (next) {
    var phoneNumber = xss(this.request.body.phoneNumber.trim()) //post 获取参数
    console.log(this.request.body)
    // var phoneNumber = this.query.phoneNumber      //get 获取参数
    console.log('查询数据库');
    var user = yield User
        .findOne({phoneNumber: phoneNumber})
        .exec() //调用exec使其promise

    console.log('生成验证吗');
    var verifyCode = sms.getCode()

    console.log('判断用户');
    if (!user) { //用户不存在加入用户 ，存在添加验证码，
        var accessToken = uuid.v4()
        console.log('phoneNumber is :' + phoneNumber)
        user = new User({
            phoneNumber: xss(phoneNumber), //xss验证安全
            verifyCode: verifyCode,
            accessToken: accessToken,
            nickName: 'Lonn',
            avatar: 'http://www.qqtouxiang.com/d/file/qinglv/20170212/f4eabd3bede4bb63ee566c39e8652ad' +
                    '7.jpg'
        })
    } else {
        user.verifyCode = sms.getCode() //验证码动态生成
    }

    console.log(user)

    // 保存
    try {
        user = yield user.save()
    } catch (e) {
        console.log(e)
        console.log('wrong')
        this.body = {
            success: false
        }
        return next
    }

    var msg = '您的注册验证码是：' + user.verifyCode

    try {
        sms.send(phoneNumber, msg)
    } catch (error) {
        console('短息发送错误：' + error)

        this.body = {
            success: false,
            error: '短息服务异常'
        }

        return next
    }

    this.body = {
        success: true
    }
    console.log('signup over')

}

/***
 * 验证用户
 */
exports.verify = function * (next) {
    var verifyCode = this.request.body.verifyCode
    var phoneNumber = this.request.body.phoneNumber

    console.log(this.request.body)
    if (!verifyCode || !phoneNumber) {
        console.log('验证未通过1')
        this.body = {
            success: false,
            error: '验证未通过2'
        }
        return next
    }

    //从数据库查询此用户
    var user = yield User
        .findOne({phoneNumber: phoneNumber, verifyCode: verifyCode})
        .exec()

    if (user) {
        user.verified = true
        user = yield user.save()

        this.body = {
            success: true,
            data: {
                nickName: user.nickName,
                accessToken: user.accessToken,
                avatar: user.avatar,
                id: user.id
            }
        }
        return next;
    } else {
        console.log('验证未通过2')
        this.body = {
            success: false,
            error: '验证未通过2'
        }
        return next
    }
}

/**
 * 更新用户
 */
exports.update = function * (next) {
    var body = this.request.body
    var accessToken = body.accessToken
    var user = this.session.user //已经通过中间件hanToken处理过

    //为用户更新并保存

    var fields = 'avatar,gender,age,nickName,breed'.split(',')

    fields.forEach(function (field) {
        if (body[field]) {
            user[field] = xss(body[field].trim())
        }
    })

    user = yield user.save()

    this.body = {
        success: true,
        data: {
            verifyCode: user.verifyCode,
            accessToken: user.accessToken,
            nickName: user.nickName,
            avatar: user.avatar,
            age: user.age,
            breed: user.breed,
            gender: user.gender,
            id: user._id
        }
    }
}
