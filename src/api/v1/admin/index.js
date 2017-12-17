
const express = require('express');
const adminMiddleware = require('./middlewares/admin.js');

const router = express.Router();

router.use(adminMiddleware);

// router.use('/users', require('./users'));
// router.use('/clients', require('./clients'));
// router.use('/policies', require('./policies'));
// router.use('/analytics', require('./analytics'));

module.exports = router;
