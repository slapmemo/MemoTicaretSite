const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, listMyOrders } = require('../controllers/ordersController');

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', listMyOrders);

module.exports = router;
