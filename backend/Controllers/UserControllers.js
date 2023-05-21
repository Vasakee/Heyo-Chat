const asyncHandler= require('express-async-handler');
const User = require('../models/UserModel');
const generateToken = require('../config/generateToken')


const registerUser = asyncHandler( async(req, res, ) => {
    const { name, email, password, profilepic } = req.body
    
    if (!name || !email || !password) {
        req.status(400);
        throw new Error('Please fill all required fields')
    }
    const userExists = await User.findOne({ email })
    
    if (userExists) {
        res.status(400);
        throw new Error('User already exists')
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
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Failed to create user ')
    }
})

const authorizeUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })

    if (user && (await user.checkPasswords(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('the email, or password is incorrect')
    }
})
const allUsers = asyncHandler(async (request, res) => {
  const keyword = request.query.search
    ? {
        $or: [
          { name: { $regex: request.query.search, $options: "i" } },
          { email: { $regex: request.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await (User.find(keyword)).find({ _id: { $ne: request.body._id } });
  res.send(users);
});

module.exports = { registerUser,authorizeUser, allUsers } 