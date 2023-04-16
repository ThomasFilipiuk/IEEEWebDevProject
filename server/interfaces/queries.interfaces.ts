import { ObjectId } from "mongodb";

interface ReviewsQuery {
  _id?: ObjectId;
  itemID?: ObjectId;
  diningHall?: string;
  review?: string;
  rating?: number;
};

export { ReviewsQuery };