var env = process.env.NODE_ENV || 'development';
if(env === 'development' || env === 'test')
{
    var Config = require('./config.json');
    var envConfig = Config[env];
    Object.keys(envConfig).forEach((item) => {
        process.env[item] = envConfig[item];
    })
}
