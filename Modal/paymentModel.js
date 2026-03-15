const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    workerName: {
        type: String,
        default: ""
    },
    workerId: {
        type: String,
        default: ""
    },
    paidBy: {
        type: String,
        default: "Unknown"
    },
    paidByEmail: {
        type: String,
        default: ""
    },
    note: {
        type: String,
        default: ""
    },
    method: {
        type: String,
        enum: ["Card", "UPI", "Netbanking"],
        default: "Card"
    },
    status: {
        type: String,
        default: "Success"
    }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
