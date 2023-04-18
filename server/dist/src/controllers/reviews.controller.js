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
                if (review.filename) {
                    const imageURL = await (0, utils_2.getFile)(review.filename);
                    review.image_url = imageURL;
                    delete review.filename;
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
        const filenames = [];
        for (const file of req.files) {
            // uploadFile returns filename of newly added s3 object
            filenames.push(await (0, utils_2.uploadFile)(file));
        }
        review_ob.filenames = filenames;
        const result = await (0, utils_1.insertOne)("reviews", review_ob);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.postReview = postReview;
