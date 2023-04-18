"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiningHall = void 0;
const utils_1 = require("../database/utils");
const mongodb_1 = require("mongodb");
const getDiningHall = async (req, res) => {
    try {
        const diningHall = req.params.diningHallName;
        const query = {};
        if (req.query._id) {
            query._id = new mongodb_1.ObjectId(req.query._id);
        }
        const result = await (0, utils_1.find)(diningHall, query);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getDiningHall = getDiningHall;
