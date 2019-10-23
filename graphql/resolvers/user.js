const User = require('../../models/user')
const {sign} = require('jsonwebtoken')
const {promisfy_mongoose} = require('../helper')
const {errorName} = require('../../error-handling');

module.exports = {
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
      makeModerator: async({email}, {me}) => {
        const currentUser = await me()
        if (currentUser && currentUser.role == 'admin') {
          try {
            const user = await promisfy_mongoose(User.findOne({
              email: email
            }).populate('posts'))
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
      makeAdmin: async({email}, {me}) => {
        const currentUser = await me()
        if (currentUser && currentUser.role == 'admin') {
          try {
            const user = await promisfy_mongoose(User.findOne({
              email: email
            }).populate('posts'))
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
      add: async ({email, password, role}, {res}) => {
        const currentUser = await me()
        if (currentUser && currentUser.role == 'admin') {
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