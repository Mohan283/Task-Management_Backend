const express = require('express');
const router = express.Router()
const {registerAdmin, loginData} =require('../controller/adminController')
const protect = require('../middleware/protect')


router.post('/admin-register', registerAdmin);  //Register USer
router.post('/admin-login', loginData)

// 🔐 PROTECTED ROUTE
router.get('/admin-dashboard', protect, (req, res) => {
  res.status(200).json({
    message: 'Welcome Admin',
    admin: req.session.user
  });
});

module.exports = router;


