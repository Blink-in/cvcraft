const mongoose = require('mongoose')

const entitlementSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    cvId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['download', 'edit'],
      default: 'download',
      index: true,
    },
    source: {
      type: String,
      enum: ['paystack', 'flutterwave', 'lemon_squeezy', 'rewarded_ad'],
      default: 'paystack',
    },
    orderId: { type: String, default: null },
    checkoutId: { type: String, default: null },
    customerEmail: { type: String, default: null },
    amount: { type: Number, default: 250 },
    currency: { type: String, default: 'USD' },
    active: { type: Boolean, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

entitlementSchema.index({ sessionId: 1, cvId: 1, type: 1, active: 1 })
entitlementSchema.index({ orderId: 1, cvId: 1, type: 1 }, { unique: true, sparse: true })

module.exports = mongoose.models.Entitlement || mongoose.model('Entitlement', entitlementSchema)
