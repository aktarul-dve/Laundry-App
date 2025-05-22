const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model name is 'User'
    required: true
  },

  wash_fold: { type: Boolean, default: false },
  wash_iron: { type: Boolean, default: false },
  dry_clean: { type: Boolean, default: false },
  iron_only: { type: Boolean, default: false },

  clothes: { type: String, required: true },
  address: { type: String, required: true },
  instructions: { type: String },

  pickupDate: { type: Date, required: true },
  pickupTime: { type: String, required: true },

  deliveryDate: { type: Date, required: true },
  deliveryTime: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  phone: { type: String, required: true},
  status: {
  type: String,
  enum: ['processing', 'pickup', 'out_for_delivery', 'delivered'],
  default: 'processing'
}


}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
