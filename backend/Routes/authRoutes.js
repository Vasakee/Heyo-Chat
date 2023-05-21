const authRoutes = require('express').Router()
const User = require('../models/UserModel')
const generateToken = require('../config/generateToken')
//const userRoutes = require('./userRoutes')


authRoutes.post('/', async(req, res, ) => {
    const { name, email, password, profilepic } = req.body

   if (!name || !email || !password) {
       res.status(400).send({
            error: 'Please fill all required fields'
        })
    }
    const userExists = await User.findOne({ email })
    
   if (userExists) {
       res.status(400).send({
           error: 'User already exists'
       })
    }
    const user = await User.create({
        name,
        email,
        password,
        profilepic
    })

    if (user) {
       res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
           password: user.password,
            profilepic: user.profilepic,
            token: generateToken(user._id)
        })
    } else {
        return res.status(400).send({
            error:'failed to create the user'
        })
    }
})
authRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })

    if (user && (await user.checkPasswords(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            profilepic: user.profilepic,
            token: generateToken(user._id)
        })
    } else {
        return res.status(400).send({
            error:'the email or password is incorrect'
        })
    }
} )

//authRoutes.use('/', userRoutes)

module.exports = { authRoutes }