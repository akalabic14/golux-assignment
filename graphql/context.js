const cookie = require('cookie')
const {verify} = require('jsonwebtoken')

const User = require('../models/user')
const {promisfy_mongoose} = require('./helper')

module.exports = (req, res) => {
    return {
        me: async () => {
            let currentUser = null;
            var cookies = cookie.parse(req.headers.cookie || '');

            if (cookies.access_token) {
                try {
                    let {userId} = verify(cookies.access_token, JWT_SECRET);
                    currentUser = await promisfy_mongoose(User.findById(userId));
                } catch (err) {
                    logger.error(err);
                }
            }

            return currentUser
        },
        res: res
    }
}