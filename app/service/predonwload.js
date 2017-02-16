'use strict'

var qiniu = require('qiniu')
var config = require('../../config/predownload')

qiniu.conf.ACCESS_KEY = config.ACCESS_KEY
qiniu.conf.SECRET_KEY = config.SECRET_KEY

var bucket = 'media'

//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key)
    return putPolicy.token()
}

exports.getQiniuToken = function(key){
    var token = new uptoken(bucket,key)
    return token
}