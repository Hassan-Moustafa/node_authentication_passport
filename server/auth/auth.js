let passport = require('passport');
let passportJWT = require('passport-jwt');
let authConfig = require("./authConfig"); 
let mongoose = require('mongoose');
let {User} = require('../models/user');

var ExtractJwt = passportJWT.ExtractJwt;  
var Strategy = passportJWT.Strategy;  

var options = {  
    secretOrKey: authConfig.jwtSecret,
    jwtFromRequest: ExtractJwt.fromHeader('x-auth')
};

module.exports = function ()
{
    var strategy = new Strategy(options, function ( JWT_Payload , done) {
        
        let _id = JWT_Payload._id;
        User.findOne({_id : _id}).then((user) => {

            //mongoose.disconnect();
            return done(null,user);

        }).catch((error) => {

            //mongoose.disconnect();
            return done(error , null);
            
        })
    });
    passport.use(strategy);

    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return  passport.authenticate('jwt',authConfig.jwtSession);
        }
    };
}









