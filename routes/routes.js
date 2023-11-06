const Router = require('express').Router()
const validator = require('../config/validator')
const passport = require('../config/passport')

const usersControlers = require('../controllers/userControllers')

const {SignUp, SignIn, verifyMail, verificarToken}= usersControlers

Router.route('/users/auth/signup')
.post(validator,SignUp)

Router.route('/users/auth/signin')
.post(SignIn)

Router.route('/users/auth/verifyEmail/:string')
.get(verifyMail)

Router.route("/users/auth/signInToken")
.get(passport.authenticate("jwt", {session:false}), verificarToken)


module.exports = Router