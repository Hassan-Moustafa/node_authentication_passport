const _ = require('lodash');
const {User} = require('../models/user');
const authConfig = require('./authConfig');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const pickBody = (requestBody) => {

    return new Promise((resolve , reject) => {

        let schemaObj = User.schema.obj;
        let schemaKeys = Object.keys(User.schema.obj);
        let body = {}
        for(let key in schemaKeys)
        {
            
            if(schemaObj[schemaKeys[key]].logInComeFromReq === 'MUST')
            {
                
                if(!requestBody[schemaKeys[key]])
                {
                    return reject({error : `${schemaKeys[key]} must be included in request`});
                }
                body[schemaKeys[key]] = requestBody[schemaKeys[key]];

            }
        }
        return resolve(body);
        
    })
}

const generateAuthToken = (user) => {

    let payLoad = {
        _id : user._id
    }
    return(jwt.sign(payLoad,authConfig.jwtSecret));

}

module.exports = function(request){

    return new Promise((resolve,reject) => {

        pickBody(request.body).then((body) => {
            
            User.findOne({email: body.email}).then((user) => {
               
                if(!user)
                {
                    
                    return reject({error : 'email or password is incorrect'});
                }
                bcrypt.compare(body.password , user.password ,function(error , res){
                    if(res)
                    {
                        let token = {
                            access : 'auth',
                            token: generateAuthToken(user)
                        }
                        user.token = token;
                        user.save();
                        return resolve({token : token.token});
                    }
                    return reject({error : 'email or password is incorrect'});
                })
            }).catch((error) => {
                return reject(error);
            })
    
        }).catch((error) => {
            return reject(error);
        })
    })
    
    
}