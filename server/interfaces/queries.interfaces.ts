import { ObjectId } from "mongodb";

interface ReviewsQuery {
  _id?: ObjectId;
  item_id?: ObjectId;
  dining_hall?: string;
  review?: string;
  rating?: number;
};

export { ReviewsQuery };