import { Router } from "express";
import { getDiningHall } from "./dining-hall.controller";
import { getReviews, postReview } from "./reviews.controller";
import { getMetadata } from "./metadata.controller";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/dining-hall/:diningHallName")
  .get(getDiningHall);

router.route("/reviews")
  .get(getReviews)
  .post(upload.array("images"), postReview);

router.route("/metadata")
  .get(getMetadata);

export default router;