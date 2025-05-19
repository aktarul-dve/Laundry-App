const express = require("express");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");

const router = express.Router();

router.post("/booking", async (req, res) => {
  const authHeader = req.headers.authorization;

  // টোকেন চেক
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // টোকেন verify এবং userId বের করা
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const {
      wash_fold,
      wash_iron,
      dry_clean,
      iron_only,
      clothes,
      address,
      instructions,
      pickupDate,
      pickupTime,
      deliveryDate,
      deliveryTime,
    } = req.body;

    // নতুন বুকিং তৈরি
    const booking = new Book({
      wash_fold,
      wash_iron,
      dry_clean,
      iron_only,
      clothes,
      address,
      instructions,
      pickupDate,
      pickupTime,
      deliveryDate,
      deliveryTime,
      user: userId,
    });

    // বুকিং সেভ করে এবং ইউজার ডেটা populate করে
    const savedBooking = await booking.save();
    await savedBooking.populate("user", "name email");

    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// ✅ নতুন GET রুট: নিজের বুকিং দেখতে
router.get("/my-bookings", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const bookings = await Book.find({ user: userId })
                               .populate("user", "name email")
                               .sort({ createdAt: -1 });

    res.status(200).json({ bookings });

  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});





module.exports = router;
