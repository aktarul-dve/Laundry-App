const express = require("express");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");

const router = express.Router();

// ✅ নতুন বুকিং তৈরি
router.post("/booking", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
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
      phone,
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
      phone,
      pickupDate,
      pickupTime,
      deliveryDate,
      deliveryTime,
      user: userId,
    });

    const savedBooking = await booking.save();
    const populatedBooking = await savedBooking.populate("user", "name email");

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// ✅ নিজের বুকিংগুলো দেখার রাউট
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

// ✅ গেট সকল বুকিং
router.get("/Allbookings", async (req, res) => {
  try {
    const allBooking = await Book.find()
                                 .populate("user", "name email");
    res.status(200).json(allBooking);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ message: "All bookings fetch failed" });
  }
});

// ✅ নতুন রাউট: স্ট্যাটাস আপডেট
router.put("/updateStatus/:id", async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  try {
    const updatedBooking = await Book.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Status update failed" });
  }
});

module.exports = router;
