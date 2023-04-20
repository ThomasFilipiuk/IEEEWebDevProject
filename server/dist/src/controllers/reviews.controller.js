"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReview = exports.getReviews = void 0;
const mongodb_1 = require("mongodb");
const utils_1 = require("../database/utils");
const utils_2 = require("../s3/utils");
// retrieve reviews that match with a specific query
const getReviews = async (req, res) => {
    try {
        const query = {};
        if (req.query._id) {
            query._id = new mongodb_1.ObjectId(req.query._id);
        }
        if (req.query.item_id) {
            query.item_id = new mongodb_1.ObjectId(req.query.item_id);
        }
        if (req.query.dining_hall) {
            query.dining_hall = req.query.dining_hall;
        }
        const response = await (0, utils_1.find)("reviews", query);
        if (response) {
            for (const review of response) {
                if (review.filenames) {
                    const imageURLs = [];
                    for (const filename of review.filenames) {
                        const imageURL = await (0, utils_2.getFile)(filename);
                        imageURLs.push(imageURL);
                    }
                    delete review.filenames;
                    review.image_urls = imageURLs;
                }
            }
        }
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getReviews = getReviews;
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
const postReview = async (req, res) => {
    try {
        const review_ob = req.body;
        if (review_ob.item_id) {
            review_ob.item_id = new mongodb_1.ObjectId(review_ob.item_id);
        }
        const filenames = [];
        for (const file of req.files) {
            // uploadFile returns filename of newly added s3 object
            filenames.push(await (0, utils_2.uploadFile)(file));
        }
        review_ob.filenames = filenames;
        const insertResponse = await (0, utils_1.insertOne)("reviews", review_ob);
        if (!insertResponse.acknowledged) {
            res.status(500).json(insertResponse);
            return;
        }
        const menuItem = await (0, utils_1.findOne)(review_ob.dining_hall, { _id: review_ob.item_id });
        const numReviews = menuItem.num_reviews + 1;
        const totalRating = menuItem.total_rating + parseInt(review_ob.rating);
        // console.log(total, numReviews, review_ob.rating, avgRating);
        const updateResponse = await (0, utils_1.updateOne)(review_ob.dining_hall, {
            _id: review_ob.item_id
        }, {
            $set: {
                num_reviews: numReviews,
                total_rating: totalRating
            }
        });
        res.json(updateResponse);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.postReview = postReview;
