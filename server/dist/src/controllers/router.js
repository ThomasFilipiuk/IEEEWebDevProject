"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dining_hall_controller_1 = require("./dining-hall.controller");
const reviews_controller_1 = require("./reviews.controller");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.route("/dining-hall/:diningHallName")
    .get(dining_hall_controller_1.getDiningHall);
router.route("/reviews")
    .get(reviews_controller_1.getReviews)
    .post(upload.single("image"), reviews_controller_1.postReview);
exports.default = router;
