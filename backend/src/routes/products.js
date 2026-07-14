const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { list, getById, create, update, remove } = require('../controllers/productsController');
const reviewsController = require('../controllers/reviewsController');

const router = Router();

router.get('/', list);
router.get('/:id', getById);
router.post('/', authMiddleware, adminMiddleware, create);
router.put('/:id', authMiddleware, adminMiddleware, update);
router.delete('/:id', authMiddleware, adminMiddleware, remove);

router.get('/:id/reviews', reviewsController.list);
router.post('/:id/reviews', authMiddleware, reviewsController.create);

module.exports = router;
