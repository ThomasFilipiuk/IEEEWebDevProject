import { Router } from "express";
import { getDiningHall } from "./dining-hall.controller";
import { getReviews, postReview } from "./reviews.controller";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/dining-hall/:diningHallName")
  .get(getDiningHall);

router.route("/reviews")
  .get(getReviews)
  .post(upload.single("image"), postReview);

export default router;