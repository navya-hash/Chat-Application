// MODELS/refreshTokenSchema.js
const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    lastUsed: { type: Date, default: Date.now }
});

const refresh=mongoose.model('RefreshToken',refreshTokenSchema)
module.exports=refresh

