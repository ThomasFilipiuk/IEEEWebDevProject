import express, { Express, query, Request, Response } from 'express';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;


app.get('/', (req: Request, res: Response) => {
  const p = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto('https://dineoncampus.com/northwestern/whats-on-the-menu', {timeout: 0});

    const querySelector = '.table.b-table.menu-items.b-table-caption-top.b-table-stacked-md';

    await page.waitForSelector(querySelector);

    const html = await page.evaluate(() => Array.from(
      document.querySelectorAll('.table.b-table.menu-items.b-table-caption-top.b-table-stacked-md'), elem => elem.textContent
    ));

    console.log(html);
    
    await browser.close();
  }
  p();
  res.send("Hi");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});