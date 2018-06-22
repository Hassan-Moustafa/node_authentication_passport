let mongoose = require('mongoose');
let _ = require('lodash');
let validator = require('validator');
const bcrypt = require('bcryptjs');

let userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        minlength: 5,
        validate:{
            validator : function(value)
            {
                return validator.isEmail(value);
            },
            message : '{VALUE} is not valid email'
        },
        comeFromReq: 'MUST'
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        comeFromReq: 'MUST'
    },
    gender:{
        type: String,
        required: false,
        comeFromReq: 'MAYBE'
    },
    phone:{
        type: String,
        required: false,
        comeFromReq: 'MAYBE'
    }
});



userSchema.pre('save',function (next){
    let user = this;
    if(user.isModified('password'))
    {
        bcrypt.genSalt(10 , (error , salt) => {
            bcrypt.hash(user.password,salt , (error , hash) => {
                user.password = hash;
                next();
            })
        })
    }
    else{
        next();
    }

})

let User = mongoose.model('User' , userSchema,'users');

module.exports = {
    User
}