const Router = require('express').Router()

const usersControlers = require('../controllers/userControllers')

const {SignUp}= usersControlers



Router.route('/users/auth/signup')
.post(SignUp)


module.exports = Router