const mongoose = require('mongoose')

const paymentAttemptSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ['paystack', 'flutterwave', 'lemon_squeezy'],
      required: true,
      index: true,
    },
    reference: { type: String, required: true, unique: true, index: true },
    checkoutUrl: { type: String, default: null },
    sessionId: { type: String, required: true, index: true },
    cvId: { type: String, required: true, index: true },
    unlockType: {
      type: String,
      enum: ['download', 'edit'],
      default: 'download',
      index: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'abandoned'],
      default: 'pending',
      index: true,
    },
    providerTransactionId: { type: String, default: null },
    customerEmail: { type: String, default: null },
    verifiedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

paymentAttemptSchema.index({ sessionId: 1, cvId: 1, unlockType: 1, status: 1, createdAt: -1 })

module.exports = mongoose.models.PaymentAttempt || mongoose.model('PaymentAttempt', paymentAttemptSchema)
