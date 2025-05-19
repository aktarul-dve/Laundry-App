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
    const userId = decoded._id;

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
      user: userId, // ইউজার আইডি সংরক্ষণ
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
