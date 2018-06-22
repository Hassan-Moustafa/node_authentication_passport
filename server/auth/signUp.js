let {User} = require('../models/user');


const pickBody = (requestBody) => {

    return new Promise((resolve , reject) => {

        let body = {}
        let schemaObj = User.schema.obj;
        let schemaKeys = Object.keys(User.schema.obj);
        for(let key in schemaKeys)
        {
            if(schemaObj[schemaKeys[key]].signUpComeFromReq === 'MUST')
            {
                if(!requestBody[schemaKeys[key]])
                {
                    return reject({error : `${schemaKeys[key]} must be included in request body`});
                }
                body[schemaKeys[key]] = requestBody[schemaKeys[key]];
            }
            else if(schemaObj[schemaKeys[key]].signUpComeFromReq === 'MAYBE')
            {
                if(!requestBody[schemaKeys[key]])
                {
                    continue;
                }
                body[schemaKeys[key]] = requestBody[schemaKeys[key]];
            }
            else{
                continue;
            }
        }
        return resolve(body);
    });
}

module.exports = function (request){

    return new Promise((resolve,reject) => {

        pickBody(request.body).then((body) => {
            
            User.findOne({email : body.email}).then((user) => {
                if(!user)
                {
                    let newUser = new User(body);
                    newUser.save().then((user) => {
                        return resolve(user);
                    }).catch((error) => {
                        return reject(error);
                    });
                }
                else{
                    return reject({error : 'email exits before'});
                }
            })
        }).catch((error) => {
            return reject(error);
        });
    })
}