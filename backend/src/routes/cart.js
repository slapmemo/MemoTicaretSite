const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getCart, addItem, updateItem, removeItem } = require('../controllers/cartController');

const router = Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', removeItem);

module.exports = router;
