import { Request, Response } from "express";
import { ReviewsQuery } from "../../interfaces/queries.interfaces";
import { ObjectId } from "mongodb";
import { find, findOne, insertOne, updateOne } from "../database/utils";
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
        if (review.filenames) {
          const imageURLs = [];
          for (const filename of review.filenames) {
            const imageURL = await getFile(filename);
            imageURLs.push(imageURL);
          }
          delete review.filenames;
          review.image_urls = imageURLs;
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

    if (review_ob.item_id) {
      review_ob.item_id = new ObjectId(review_ob.item_id);
    }

    const filenames = [];
    for (const file of req.files as Express.Multer.File[]) {
      // uploadFile returns filename of newly added s3 object
      filenames.push(await uploadFile(file));
    }

    review_ob.filenames = filenames;

    const insertResponse = await insertOne("reviews", review_ob);

    if (!insertResponse.acknowledged) {
      res.status(500).json(insertResponse);
      return;
    }
    
    const menuItem = await findOne(review_ob.dining_hall, {_id: review_ob.item_id});
    
    const numReviews = menuItem.num_reviews + 1;
    const totalRating = menuItem.total_rating + parseInt(review_ob.rating);

    // console.log(total, numReviews, review_ob.rating, avgRating);

    const updateResponse = await updateOne(review_ob.dining_hall, 
      {
        _id: review_ob.item_id
      },
      {
        $set: {
          num_reviews: numReviews,
          total_rating: totalRating
        }
      }
    );

    res.json(updateResponse);
    

  }
  catch(err: any){
    res.status(500).json({error: err.message });
  }
}

export { getReviews, postReview };