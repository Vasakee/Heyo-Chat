const userRoutes = require('express').Router()
const { registerUser, authorizeUser, allUsers } = require('../Controllers/UserControllers')
const  protect  = require('../middlewares/authmiddleware')


userRoutes.post('/', (registerUser))
userRoutes.post('/login', authorizeUser)
userRoutes.get('/', ( protect, allUsers))


module.exports = userRoutes  


