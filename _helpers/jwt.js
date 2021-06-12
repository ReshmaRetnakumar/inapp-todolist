const expressJwt = require('express-jwt');
const { secret } = require('../config.json');

module.exports = jwt;

function jwt() {
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/login'
        ]
    });
}