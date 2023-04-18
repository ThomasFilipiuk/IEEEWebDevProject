import { ObjectId } from "mongodb";

interface ReviewsQuery {
  _id?: ObjectId;
  item_id?: ObjectId;
  review?: string;
  rating?: number;
  filenames?: string[];
};

export { ReviewsQuery };