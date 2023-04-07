import express, { Express, query, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import scrapeJob from './src/utils/scrape';
import fs from 'fs';
import databaseClient from './src/database/client';
import {insertOne, deleteOne, find } from './src/database/utils';
import cors from 'cors';

var bodyParser = require('body-parser');

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const db_name = process.env.MONGODB_DB_NAME;
app.use(bodyParser.json());
app.use(cors({origin: '*', credentials: true}));


app.get('/dining-hall/:diningHallName', (req, res) => {
  const diningHall = req.params.diningHallName
  fs.readFile(`${diningHall}.json`, async (err, data) => {
    if (err) {
      res.status(404).json({ error: "dining hall not found" });
      return;
    }
    if (data.length === 0) {
      res.status(404).json({ error: "dining hall not found" });
      return;
    }
    const result = await find(diningHall, {"diningHall" : req.params.diningHallName});
    res.send(result);
    
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(fs.readFileSync('docs.json').toString())));
scrapeJob.start();

app.listen((port), () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

//enter a review into the database
app.post('/reviews', async (req, res) => {
  try {
    const review_ob = req.body;
    const result = await insertOne("reviews", review_ob);
    res.send(result);
  }
  catch(err:any){
    res.status(500).json({ "error": err.message });
}})

//retrieve all the reviews for a dininghall from the database
app.get('/reviews/:diningHallName', async (req,res)=> {
  try {
    const result = await find('reviews',{"diningHall" : req.params.diningHallName});
    res.send(result);
  }
  catch(err:any){
    res.status(500).json({ "error": err.message });
  }

})