var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    // config.json file is in gitignore
    // as it contains all types of env variables, jwt secret, third party api keys etc
    // so it remains local (dev and test env only)
    // for production all values set from server cli directly
    var config = require('./config.json');
    var envConfig = config[env];
    // loop through all keys as per dev or test env and saved process.env var
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
} else if (env === 'production') {
    // heroku OR deployment server set those two values
}
