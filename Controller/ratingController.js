const ratingModel = require('../Modal/ratingModel');

// Submit or update a rating (upsert)
const submitRatingController = async (req, res) => {
    try {
        const userId = req.userid;
        const { workerId, stars, review } = req.body;

        if (!workerId || !stars) {
            return res.status(400).json({ message: "workerId and stars are required" });
        }

        const rating = await ratingModel.findOneAndUpdate(
            { workerId, userId },
            { stars, review: review || "" },
            { upsert: true, new: true }
        );

        return res.status(200).json({ message: "Rating submitted", rating });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all ratings for a worker with average
const getWorkerRatingsController = async (req, res) => {
    try {
        const { workerId } = req.params;

        const ratings = await ratingModel
            .find({ workerId })
            .populate("userId", "username profilepic")
            .sort({ createdAt: -1 });

        const total = ratings.length;
        const average = total > 0
            ? parseFloat((ratings.reduce((sum, r) => sum + r.stars, 0) / total).toFixed(1))
            : 0;

        return res.status(200).json({ ratings, average, total });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get the logged-in user's own rating for a specific worker
const getMyRatingController = async (req, res) => {
    try {
        const userId = req.userid;
        const { workerId } = req.params;

        const rating = await ratingModel.findOne({ workerId, userId });
        return res.status(200).json({ rating: rating || null });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { submitRatingController, getWorkerRatingsController, getMyRatingController };
