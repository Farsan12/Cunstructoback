const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const ratingSchema = new mongoose.Schema({
    workerId: { type: ObjectId, ref: "users", required: true },
    userId:   { type: ObjectId, ref: "users", required: true },
    stars:    { type: Number, required: true, min: 1, max: 5 },
    review:   { type: String, default: "" }
}, { timestamps: true });

// One rating per user per worker
ratingSchema.index({ workerId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("rating", ratingSchema);
