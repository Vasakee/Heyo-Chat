const express = require("express")
const  { protect } = require("../middlewares/authmiddleware")
const {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require('../Controllers/chatController')

const chatRoutes = express.Router()

chatRoutes.route('/').post(protect, accessChat)
chatRoutes.route('/').get(protect, fetchChats)
chatRoutes.route('/group').post(protect, createGroupChat)
chatRoutes.route('/rename').put(protect, renameGroup)
chatRoutes.route('/removeFromGroup').put(protect, removeFromGroup)
chatRoutes.route('/addTogroup').put(protect, addToGroup)

module.exports =  chatRoutes  