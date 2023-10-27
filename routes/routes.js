const Router = require('express').Router()
const validator = require('../config/validator')

const usersControlers = require('../controllers/userControllers')

const {SignUp, SignIn}= usersControlers



Router.route('/users/auth/signup')
.post(validator,SignUp)

Router.route('/users/auth/signin')
.post(SignIn)


module.exports = Router