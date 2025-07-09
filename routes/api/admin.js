const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");
const verifyJWT = require('../../middleware/verifyJWT')

router.route('/admin')


.post(adminController.addAFelidsInDatabase)
 // ✅ This line enables updates

module.exports = router;