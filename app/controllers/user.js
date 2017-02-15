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
    var phoneNumber = this.request.body.phoneNumber //post 获取参数
    // var phoneNumber = this.query.phoneNumber      //get 获取参数

    var user = yield User
        .findOne({phoneNumber: phoneNumber})
        .exec() //调用exec使其promise

    var verifyCode = sms.getCode()

    if (!user) { //用户不存在加入用户 ，存在添加验证码，
        var accessToken = uuid.v4()

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
        console.log(error)

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

    if (!verifyCode || !phoneNumber) {
        this.body = {
            success: false,
            error: '验证未通过'
        }
        return next
    }

    //从数据库查询此用户
    var user = yield User
        .findOne({phoneNumber: phoneNumber, verifyCode: verifyCode})
        .exec()

    if (user) {
        user.verifid = true
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
    } else {
        this.body = {
            success: false,
            error: '验证未通过'
        }
    }

    this.body = {
        success: true
    }
}

/**
 * 更新用户
 */
exports.update = function * (next) {
    var body = this.request.body
    var accessToken = body.accessToken

    //根据用户accessToken从用户表查询
    var user = yield User
        .findOne({accessToken: accessToken})
        .exec()

    //处理用户未找到
    if (!user) {
        this.body = {
            success: false,
            error: '用户未找到'
        }
        return next
    }

    //为用户更新并保存

    var fields = 'avatar,gender,age,nickName,breed'.split(',')

    fields.forEach(function (field) {
        if (body[field]) {
            user[field] = body[field]
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
