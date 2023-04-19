"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = void 0;
const utils_1 = require("../database/utils");
const getMetadata = async (req, res) => {
    try {
        const response = {};
        const diningHalls = ["allison", "elder", "plex-east", "plex-west", "sargent"];
        for (const diningHall of diningHalls) {
            // response.diningHall 
            const topItem = await (0, utils_1.findTopRating)("reviews", diningHall);
            const avgRating = await (0, utils_1.findAverageRating)("reviews", diningHall);
            const imageLink = "image link";
            response[diningHall] = {
                top_item: topItem,
                avg_rating: avgRating,
                image_link: imageLink
            };
        }
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getMetadata = getMetadata;
