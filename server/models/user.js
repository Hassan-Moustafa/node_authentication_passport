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
        signUpComeFromReq: 'MUST',
        logInComeFromReq: 'MUST'
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        signUpComeFromReq: 'MUST',
        logInComeFromReq: 'MUST'
    },
    gender:{
        type: String,
        required: false,
        signUpComeFromReq: 'MAYBE'
    },
    phone:{
        type: String,
        required: false,
        signUpComeFromReq: 'MAYBE'
    },
    token:{
        access:{
            type: String,
            required: false
        },
        token:{
            type:String,
            required: false
        }
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

let User = mongoose.model('User' , userSchema);

module.exports = {
    User
}