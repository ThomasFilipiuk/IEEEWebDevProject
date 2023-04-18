import { Request, Response } from "express";
import { ReviewsQuery } from "../../interfaces/queries.interfaces";
import { ObjectId } from "mongodb";
import { find, insertOne } from "../database/utils";
import { uploadFile, getFile } from "../s3/utils";

// retrieve reviews that match with a specific query
const getReviews = async(req: Request, res: Response) => {
  try {
    const query: ReviewsQuery = {};
    if (req.query._id) {
      query._id = new ObjectId(req.query._id as string);
    }
    if (req.query.item_id) {
      query.item_id = new ObjectId(req.query.item_id as string);
    }
    if (req.query.dining_hall) {
      query.dining_hall = req.query.dining_hall as string;
    }

    const response = await find("reviews", query);

    if (response) {
      for (const review of response) {
        if (review.filename) {
          const imageURL = await getFile(review.filename);
          review.image_url = imageURL;
          delete review.filename;
        }
      }
    }

    res.json(response);
  }
  catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

// //retrieve all the reviews for a dininghall from the database
// app.get('/reviews/:diningHallName', async (req,res)=> {
//   try {
//     const result = await find('reviews',{"diningHall" : req.params.diningHallName});
//     res.send(result);
//   }
//   catch(err:any){
//     res.status(500).json({ "error": err.message });
//   }

// });

// enter a review into the database
const postReview = async(req: Request, res: Response) => {
  try {
    const review_ob = req.body;

    if (req.file) {
      const filename = await uploadFile(req.file);
      review_ob.filename = filename;
    }

    const result = await insertOne("reviews", review_ob);
    res.json(result);
  }
  catch(err: any){
    res.status(500).json({error: err.message });
  }
}

export { getReviews, postReview };