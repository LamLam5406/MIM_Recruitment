const router = require('express').Router();
const newsController = require('../controllers/news.controller');
const verifyToken = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Public routes (Không cần verifyToken)
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Admin routes (Cần verifyToken và middleware upload ảnh)
router.post('/', verifyToken, upload.single('cover_image'), newsController.createNews);
router.put('/:id', verifyToken, upload.single('cover_image'), newsController.updateNews);
router.delete('/:id', verifyToken, newsController.deleteNews);

module.exports = router;