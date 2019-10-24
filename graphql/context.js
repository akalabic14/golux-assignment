const cookie = require('cookie')
const {verify} = require('jsonwebtoken')

const User = require('../models/user')
const {promisfy_mongoose} = require('./helper')

module.exports = (req, res) => {
    return {
/**
 * @function me
 * @returns {Object<SimpleUser>}
 * @description Reads access_token from user, then gets userId from jwt token, and returns user with that id
 */
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
/**
 * @returns {Object<res>}
 * @description Returns exporess response object
 */
        res: res
    }
}