import express, { Express, query, Request, Response } from 'express';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import fs from 'fs';

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

    const categories = await page.evaluate((querySelector) => {
      const mapMenuItems = (menuItemElem: Element) => {
        const menuItemWrapper = menuItemElem.querySelector('.category-items_itemNameWrapperSm_1wGbS');
        const menuItemName = menuItemWrapper?.querySelector('strong')?.textContent?.trim();
        
        const textNodes = Array.prototype.filter.call(
          menuItemWrapper?.childNodes, 
          e => e.nodeType === Node.TEXT_NODE
        )
        .map(e => e.textContent);
        const menuItemDescription = textNodes[0].trim();
        
        const attributes = Array.from(menuItemElem.querySelectorAll('.category-items_icon_1urJ3'), e=>e.src);
        // make map function that splits src by '_' and gets attribute

        const portion = menuItemElem.querySelector('[data-label=Portion]')?.textContent;
        const calories = menuItemElem.querySelector('[data-label=Calories]')?.textContent;

        // const nutritionalInfoButton = menuItemElem.querySelector('button');
        // nutritionalInfoButton?.click();

        return {
          name: menuItemName,
          description: menuItemDescription,
          attributes: attributes,
          portion: portion,
          calories: calories,
          // nutritionalInfo: nutritionalInfo
        };
      }

      const mapCategories = (categoryElem: Element) => {
        const categoryName = categoryElem.querySelector('caption')?.textContent;
        
        const tableBody = categoryElem.querySelector('tbody');
        const menuItems = Array.from(tableBody.querySelectorAll('tr'), mapMenuItems);

        return {
          name: categoryName,
          menuItems: menuItems
        };
      }

      // returns array of categories
      return Array.from(document.querySelectorAll(querySelector), mapCategories);
    }, querySelector);

    // console.log(JSON.stringify(categories));
    fs.writeFile('allison.json', JSON.stringify(categories), err => {
      if (err) {
        console.error(err);
      }
    });
    
    await browser.close();
  }
  p();
  res.send("Scraping web data");
});

app.get('/dining-hall/:diningHallName', (req, res) => {
  fs.readFile(`${req.params.diningHallName}.json`, (err, data) => {
    if (err) {
      res.status(404).json({ error: "dining hall not found" });
      return;
    }

    res.json(JSON.parse(data.toString()));
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});