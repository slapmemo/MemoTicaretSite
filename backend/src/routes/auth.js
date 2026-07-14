const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  register,
  login,
  me,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, changePassword);

module.exports = router;
