"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiningHall = void 0;
const utils_1 = require("../database/utils");
const getDiningHall = async (req, res) => {
    try {
        const diningHall = req.params.diningHallName;
        const result = await (0, utils_1.find)(diningHall, { "diningHall": req.params.diningHallName });
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getDiningHall = getDiningHall;
