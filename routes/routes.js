const Router = require('express').Router()
const validator = require('../config/validator')

const usersControlers = require('../controllers/userControllers')

const {SignUp, SignIn, verifyMail}= usersControlers



Router.route('/users/auth/signup')
.post(validator,SignUp)

Router.route('/users/auth/signin')
.post(SignIn)

Router.route('/users/auth/verifyEmail/:string')
.get(verifyMail)


module.exports = Router