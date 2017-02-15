'use strict'

var mongoose = require('mongoose')

var UserSchema  =new mongoose.Schema({ //约定

	phoneNumber:{
		unique :true,
		type:String
	},
	areaCode:String,
	verifyCode:String,
	verified:{
		type:Boolean,
		default:false
	},
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

	if(!this.isNew){
		this.meta.updateAt = Date.now()
	}

	console.log('next')
	next()
})


//将Schema发布为Model
module.exports = mongoose.model('User',UserSchema)
  
