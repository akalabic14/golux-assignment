const User = require('../../models/user')
const {sign} = require('jsonwebtoken')
const {promisfy_mongoose} = require('../helper')
const {errorName} = require('../../error-handling');

module.exports = {
/**
 * @function register
 * @returns {Boolean}
 * @description Creates user and puts jwt token in access_token.
 */
    register: async ({user}, {res}) => {
        try {
          const new_user = new User({
            email: user.email,
            password: user.password,
            role: 'user'
          })
          const saved = await new_user.save()
          
          const token = sign(
            {
              userId: saved.id
            },
            JWT_SECRET,
            { expiresIn: "7d" }
          )
    
          res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
          })
    
          return true

        } catch (err) {
            logger.error(err);
            return false
        }
      },
    /**
   * @function login
   * @returns {Boolean}
   * @description Checks if there is an user with passed email and password, and jwt token in access_token.
   */
      login: async ({user}, {res}) => {
        try {
          const found_user = await promisfy_mongoose(User.findOne({
              email: user.email,
              password: user.password
          }))
          if (found_user) {
              const token = sign(
                  {
                    userId: found_user.id
                  },
                  JWT_SECRET,
                  { expiresIn: "7d" }
                )
          
                res.cookie("access_token", token, {
                  httpOnly: true,
                  maxAge: 1000 * 60 * 60 * 24 * 7
                })
          
                return true
          } else {
              return false
          }
        } catch (err) {
          logger.error(err);
          return false
        }
      },
/**
 * @function logout
 * @returns {Boolean}
 * @description Deletes jwt token in access_token.
 */
      logout: async (_, {res}) => {
        try {
          res.cookie("access_token", null, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
          })
          return true
        } catch (err) {
          logger.error(err)
          return false
        }
      },
/**
 * @function updatePassword
 * @returns {Boolean}
 * @description Updates pasword for currently logged user
 */
      updatePassword: async({password}, {me}) => {
        const currentUser = await me()
        if (currentUser) {
          try {
            currentUser.password = password
            await currentUser.save()
            return true
          } catch (err) {
            logger.error(err)
            return false
          }
        } else {
          throw new Error(errorName.UNAUTHORIZED)
        }
      },
/**
 * @function getAll
 * @returns {Array<UserOutput>}
 * @description Returns array of all users if current user is admin
 */
      getAll: async(_, {me}) => {
        const currentUser = await me()
        if (currentUser && currentUser.role == 'admin') {
          try {
            const users = await promisfy_mongoose(User.find().populate('posts'))
            return users
          } catch (err) {
            logger.error(err)
            return []
          }
        } else {
          throw new Error(errorName.UNAUTHORIZED)
        }
      },
/**
 * @function makeModerator
 * @returns {Boolean}
 * @description Updates role to moderator for user with passed email if current user is admin
 */
      makeModerator: async({email}, {me}) => {
        const currentUser = await me()
        if (currentUser && currentUser.role == 'admin') {
          try {
            const user = await promisfy_mongoose(User.findOne({
              email: email
            }))
            user.role='moderator';
            await user.save();
            return true
          } catch (err) {
            logger.error(err)
            return false
          }
        } else {
          throw new Error(errorName.UNAUTHORIZED)
        }
      },
/**
 * @function makeAdmin
 * @returns {Boolean}
 * @description Updates role to admin for user with passed email if current user is admin
 */
      makeAdmin: async({email}, {me}) => {
        const currentUser = await me()
        if (currentUser && currentUser.role == 'admin') {
          try {
            const user = await promisfy_mongoose(User.findOne({
              email: email
            }))
            user.role='admin';
            await user.save();
            return true
          } catch (err) {
            logger.error(err)
            return false
          }
        } else {
          throw new Error(errorName.UNAUTHORIZED)
        }
      },
/**
 * @function remove
 * @returns {Boolean}
 * @description Removes user with passed email if current user is admin
 */
      remove: async({email}, {me}) => {
        const currentUser = await me()
        if (currentUser && currentUser.role == 'admin') {
          try {
            await promisfy_mongoose(User.deleteOne({
              email: email
            }))
            return true
          } catch (err) {
            logger.error(err)
            return false
          }
        } else {
          throw new Error(errorName.UNAUTHORIZED)
        }
      },
/**
 * @function add
 * @returns {Boolean}
 * @description Creates user with passed email, password and role if current user is admin
 */
      add: async ({user}, {res}) => {
        const {email, password, role} = user
        const currentUser = await me()
        if (currentUser && currentUser.role == 'admin') {
          if (['user', 'moderator', 'admin'].indexOf(role) == -1) {
            throw new Error(errorName.INVALID_ROLE)
          }
          try {
            const new_user = new User({
              email: email,
              password: password,
              role: role
            })
            await new_user.save()
            
            return true
          } catch (err) {
              logger.error(err);
              return false
          }
        } else {
          throw new Error(errorName.UNAUTHORIZED)
        }
      }
}