const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);
router.get("/user/:id", bookingController.getBookingsByUser);
router.get("/listing/:id", bookingController.getBookingsByListing);

module.exports = router;
