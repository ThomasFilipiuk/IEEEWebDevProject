import express, { Express, query, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import scrapeJob from './src/utils/scrape';
import fs from 'fs';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;


app.get('/dining-hall/:diningHallName', (req, res) => {
  fs.readFile(`${req.params.diningHallName}.json`, (err, data) => {
    if (err) {
      res.status(404).json({ error: "dining hall not found" });
      return;
    }
    if (data.length === 0) {
      res.status(404).json({ error: "dining hall not found" });
      return;
    }

    //query the mongo database here
    
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(fs.readFileSync('docs.json').toString())));

scrapeJob.start();
console.log('scrape task scheduled');
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/dining-hall/:reviews', (req, res) => {

})