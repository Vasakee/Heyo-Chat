const express = require('express')
const { protect } = require('../middlewares/authmiddleware')
const {sendMessage, allMessages} = require('../Controllers/MessageControllers')

const router = express.Router()

router.route('/').post(protect, sendMessage)
router.route('/:chatId').get(protect, allMessages)

module.exports = router