const express = require("express");
const router = express.Router();
const listingController = require("../../controllers/listingController");

router.get("/", listingController.getAllListing);
router.get("/:id", listingController.getListingById);
router.post("/", listingController.createNewListing);
router.put("/:id", listingController.updateListingStatus);
 // ✅ This line enables updates

module.exports = router;