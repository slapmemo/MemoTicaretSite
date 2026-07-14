const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { adminListOrders, adminUpdateStatus } = require('../controllers/ordersController');
const { listUsers, dashboard } = require('../controllers/adminController');

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/orders', adminListOrders);
router.put('/orders/:id/status', adminUpdateStatus);
router.get('/users', listUsers);
router.get('/dashboard', dashboard);

module.exports = router;
