import dotenv from 'dotenv';
import scrapeJob from './src/utils/scrape';
import {insertOne, deleteOne, find, findTopRating, findAverageRating } from './src/database/utils';
import app from "./server";

dotenv.config();


scrapeJob.start();

const port = process.env.PORT;
app.listen((port), () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

//send the metadata for a dining hall
app.get('/metaData/:diningHallName', async (req,res) => {
  try{
    const diningHall = req.params.diningHallName;
    //topItem, avgRating = await find_top_item(diningHall);
    const topItem= await findTopRating("reviews",diningHall);
    const avgRating= await findAverageRating("reviews",diningHall);
    const imageLink = "image link";
    res.json({"diningHall":diningHall,
              "topItem": topItem,
              "avgRating":avgRating,
              "imageLink":imageLink
  });
  }
  catch(err:any){
    res.status(500).json({"error": err.message});
  }})

//implement databases for daily items
