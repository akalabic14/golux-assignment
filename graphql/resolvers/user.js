const User = require('../../models/user')
const {sign} = require('jsonwebtoken')
const {promisfy_mongoose} = require('../helper')

module.exports = {
    register: async ({user}, context) => {
        try {
          const {res} = await context()
          const new_user = new User({
            email: user.email,
            password: user.password
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
      login: async ({user}, context) => {
        try {
          const {res} = await context()
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
      }
}