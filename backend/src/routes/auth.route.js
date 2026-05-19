const router = require('express').Router();
const userController = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/login', userController.login);
router.get('/profile', verifyToken, userController.getProfile); 
router.put('/profile', verifyToken, upload.single('file'), userController.updateProfile);

module.exports = router;
