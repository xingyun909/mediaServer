'use strict'

var mongoose = require('mongoose')

var UserSchema  =new mongoose.Schema({

	phoneNumber:{
		unique :true,
		type:String
	},
	areaCode:String,
	verifyCode:String,
	accessToken:String,
	nickName:String,
	gender:String,
	breed:String,
	age:String,
	avatar:String,
	meta:{
		createAt:{
			type:Date,
			default: Date.now()
		},
		updateAt:{
			type:Date,
			default: Date.now()
		}
	}

})

UserSchema.pre('save',function (next) {
	console.log('save in')

	if(this.isNew){
		this.meta.updateAt = Date.now()
	}

	console.log('next')
	next()
})

module.exports = mongoose.model('User',UserSchema)
  
