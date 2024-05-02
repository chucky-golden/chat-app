const router = require('express').Router();
const userChat = require('../controllers/userChat')


router.get('/:id', userChat.chatLoad)

module.exports = router