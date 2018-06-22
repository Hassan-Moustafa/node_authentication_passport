const User = require('../models/user');

module.exports = function (req)
{

    return new Promise((resolve , reject) => {
        let user = req.authInfo;
        user.token = null
        user.save();
        resolve();
    })
}