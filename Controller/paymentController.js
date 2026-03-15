const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../Modal/paymentModel');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /payment/create-order
const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // amount in rupees

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const options = {
            amount: Math.round(Number(amount) * 100), // paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Razorpay create order error:", error);
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};

// POST /payment/verify
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Razorpay verify error:", error);
        res.status(500).json({ message: "Verification error", error: error.message });
    }
};

// POST /payment/save  — called after dummy payment success
const savePayment = async (req, res) => {
    try {
        const { paymentId, amount, workerName, workerId, paidBy, paidByEmail, note, method } = req.body;
        if (!paymentId || !amount) {
            return res.status(400).json({ message: "paymentId and amount are required" });
        }
        const record = new Payment({ paymentId, amount, workerName, workerId, paidBy, paidByEmail, note, method });
        await record.save();
        res.status(201).json({ success: true, record });
    } catch (error) {
        console.error("Save payment error:", error);
        res.status(500).json({ message: "Failed to save payment", error: error.message });
    }
};

// GET /payment/all  — admin sees all payments
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, payments });
    } catch (error) {
        console.error("Get payments error:", error);
        res.status(500).json({ message: "Failed to fetch payments", error: error.message });
    }
};

// DELETE /payment/:id  — admin deletes single record
const deletePayment = async (req, res) => {
    try {
        await Payment.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};

module.exports = { createOrder, verifyPayment, savePayment, getAllPayments, deletePayment };
