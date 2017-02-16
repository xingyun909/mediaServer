'use strict'

var Router = require('koa-router')
var User = require('../app/controllers/user')
var App = require('../app/controllers/app')
module.exports = function () {
    var router = new Router({prefix: '/api/1'})

    /***User***/
    router.post('/u/signup', App.hasBody, User.signup)

    router.post('/u/verify', App.hasBody, User.verify)

    //App.hasBody--> App.hasToken-->User.update
    router.post('/u/update', App.hasBody, App.hasToken, User.update)
    router.get('/', function * (next) {

        this.body = {
            success: true
        }
    })

     /***app***/
    router.post('/signature', App.signature)

    return router
}
