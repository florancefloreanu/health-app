var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
var UserModel = require('../models/User');
var key = require('./keys');


dotenv.config();
const verifyToken = async (req, res, next) => {

    const authToken = req.get('Authorization');
    if (!authToken) {
        req.isAuth = false;
        return next()
    }
    const token = authToken.split(' ')[1];
    let verify;
    try {
        verify = jwt.verify(token, key.public_key);
    } catch (error) {
        req.isAuth = false;
        return next()
    }
    if (!verify._id) {
        req.isAuth = false;
        return next()
    }
    const user = await UserModel.findById(verify._id);
    if (!user) {
        req.isAuth = false;
        return next()
    }
    req.userId = user._id;
    req.isAuth = true;
    next()
}
module.exports = {verifyToken};