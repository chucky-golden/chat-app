const router = require('express').Router();
const upload = require("../middlewares/uploads");
const userController = require('../controllers/userController')
const auth = require('../middlewares/auth');


router.get('/register', auth.isLogout, userController.registerLoad)
router.post('/register', upload.single("file"), userController.register)

router.get('/', auth.isLogout, userController.loadLogin)
router.post('/', userController.login)

router.get('/logout', auth.isLogin, userController.logout)
router.get('/dashboard', auth.isLogin, userController.loadDashboard)

module.exports = router