import express, { Express, query, Request, Response } from 'express';
import dotenv from 'dotenv';
import puppeteer, { ElementHandle, Page } from 'puppeteer';
import swaggerUi from 'swagger-ui-express';
import cron from 'node-cron';
import fs from 'fs';
import { Category, MenuItem, Attribute, NutritionalInfo, Nutrient } from './types/types';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const mapNutritionalInfo = async(nutritionalInfoElements: ElementHandle[]) => {
  const nutritionalInfo = {};

  for (const nutritionalInfoElement of nutritionalInfoElements) {
    const menuItemName = await nutritionalInfoElement.$eval(".modal-title", e => e.textContent);
    const nutrientElements = await nutritionalInfoElement.$$("li");

    const nutrients: Nutrient[] = [];
    for (const nutrientElement of nutrientElements) {
      const nutrientText = await nutrientElement.evaluate(e => e.textContent);
      const nutrientTrimmed = nutrientText?.trim();
      const nutrient = nutrientTrimmed?.split(': ');

      if (nutrient) {
        nutrients.push({
          name: nutrient[0],
          value: nutrient[1].trim()
        });
      }
    }
    
    const modalBody = await nutritionalInfoElement.$(".modal-body");
    const modalBodyDiv = await modalBody?.$("div");
    const ingredientsText = await modalBodyDiv?.$eval("div", e => e.textContent);
    const ingredientsTextTrimmed = ingredientsText?.trim();
    const ingredientsSplit = ingredientsTextTrimmed?.split(': ');
    const ingredientsUntrimmed = ingredientsSplit[1].split(',');

    const ingredients: string[] = [];
    for (const ingredient of ingredientsUntrimmed) {
      ingredients.push(ingredient.trim());
    }

    await nutritionalInfoElement.evaluate(e => {
      const close = e.querySelector(".close");
      close.click();
    });

    nutritionalInfo[menuItemName] = {
      ingredients,
      nutrients
    };
  }

  return nutritionalInfo;
}

const mapAttributes = async(attributeElements: ElementHandle[]): Promise<Attribute[]> => {
  return Promise.all(attributeElements.map(async(attributeElement) => {
    const attributes = {
      "https://dineoncampus.com/img/icon_balanced_200px.png": {name: "Balanced", description: "Food that has balanced nutrients & portion size."},
      "https://dineoncampus.com/img/icon_vegan_200px.png": {name: "Vegan", description: "Contains no animal-based ingredients or by-products."},
      "https://dineoncampus.com/img/icon_vegetarian_200px.png": {name: "Vegetarian", description: "Contains no meat, poultry, fish or seafood but may contain eggs or dairy."},
      "https://dineoncampus.com/img/icon_avoiding_gluten_200px.png": {name: "Gluten-free", description: "Menu items made without gluten containing ingredients."},
      "https://dineoncampus.com/img/howgood-best.png": {name: "Best", description: "Recipe has an environmental and social impact better than 95% of food."},
      "https://dineoncampus.com/img/howgood-great.png": {name: "Great", description: "Recipe has an environmental and social impact better than 85% of food."},
      "https://dineoncampus.com/img/howgood-good.png": {name: "Good", description: "Recipe has an environmental and social impact better than 75% of food."},
      "https://dineoncampus.com/img/howgood-climate-friendly.png": {name: "Climate friendly", description: "This recipe has a Farm-To-Gate Carbon Footprint lower than 70% of conventional food at large."}
    };
    // mapping src of img to name and description
    // @ts-ignore
    const attributeSrc = await attributeElement.evaluate(e => e.src);
    return attributes[attributeSrc as keyof typeof attributes];
  }));
}

const mapMenuItems = async(menuItemsElements: ElementHandle[], page: Page): Promise<MenuItem[]> => {
  return await Promise.all(menuItemsElements.map(async(menuItemElement): Promise<MenuItem> => {
    const menuItemWrapper = await menuItemElement.$('.category-items_itemNameWrapperSm_1wGbS');
    const menuItemName = await menuItemWrapper?.$eval('strong', e => e.textContent);
    let menuItemNameTrimmed = menuItemName?.trim();
    if (!menuItemNameTrimmed) {
      menuItemNameTrimmed = "";
    }

    const textNodes = await menuItemWrapper?.evaluate(element => {
      return Array.prototype.filter.call(
        element.childNodes,
        e => e.nodeType === Node.TEXT_NODE
      ).map(node => node.textContent);
    });

    let menuItemDescription = "";
    if (textNodes) {
      menuItemDescription = textNodes[0].trim();
    }

    const attributesElements = await menuItemElement.$$('.category-items_icon_1urJ3');
    const attributes = await mapAttributes(attributesElements);

    let portion = await menuItemElement.$eval('[data-label=Portion]', e => e.textContent);
    if (!portion) {
      portion = "";
    }

    let calories;
    let caloriesText = await menuItemElement.$eval('[data-label=Calories]', e => e.textContent);
    if (caloriesText) {
      calories = parseInt(caloriesText);
    }

    const nutritionalInfoButton = await menuItemWrapper?.$(".btn.mt-3.btn-nutrition.btn-info-outline.btn-sm");
    await nutritionalInfoButton?.evaluate(e => e.click());
      
    await page.waitForSelector(".modal-content");

    return {
      name: menuItemNameTrimmed,
      description: menuItemDescription,
      attributes: attributes,
      portion: portion,
      calories: calories,
      nutritionalInfo: {ingredients: [], nutrients: []}
    };
  }));
}

const mapCategories = async(categoriesElements: ElementHandle[], page: Page): Promise<Category[]> => {
  return await Promise.all(categoriesElements.map(async(categoryElement): Promise<Category> => {
    let categoryName = await categoryElement.$eval('caption', e => e.textContent);
    if (!categoryName) {
      categoryName = "";
    }
    
    const tableBody = await categoryElement.$('tbody');

    const menuItemsElements = await tableBody?.$$('tr');

    let menuItems: MenuItem[]  = [];
    if (menuItemsElements) {
      menuItems = await mapMenuItems(menuItemsElements, page);
    }
    
    const nutritionalInfoElements = await page.$$(".modal-content");

    const nutritionalInfoObj = await mapNutritionalInfo(nutritionalInfoElements);

    await page.waitForSelector("#nutritional-modal-61f477db8f3eb63e48343c03-63e888d4c625af07221997ca___BV_modal_outer_", {hidden: true});

    for (const menuItem of menuItems) {
      menuItem.nutritionalInfo = nutritionalInfoObj[menuItem.name as keyof typeof nutritionalInfoObj];
    }

    return {
      name: categoryName,
      menuItems: menuItems
    };
  }));
}

const scrapeCategories = async(page: Page) => {
  const querySelector = '.table.b-table.menu-items.b-table-caption-top.b-table-stacked-md';

  await page.waitForSelector(querySelector);

  const categories = await page.$$(querySelector);
  
  return await mapCategories(categories, page);
}

const scrapeDiningHallInfo = async() => {
  const browser = await puppeteer.launch({headless: false})

  const page = await browser.newPage();

  await page.goto('https://dineoncampus.com/northwestern/whats-on-the-menu', {timeout: 0});

  const diningHallInfo = [];
  const diningHallNames = ["allison", "sargent", "plex-west", "plex-east", "elder"];
  diningHallInfo.push(await scrapeCategories(page)); // allison

  page.click("#dropdown-grouped__BV_toggle_");
  page.waitForSelector("[aria-describedby=building_6113ef5ae82971150a5bf8ba]");
  const dropdownItems = await page.$$("[aria-describedby=building_6113ef5ae82971150a5bf8ba]");
  for (let i = 1; i <= 4; i++) {
    dropdownItems[i].evaluate(e => e.click());
    diningHallInfo.push(await scrapeCategories(page));
  }

  for (let i = 0; i < diningHallNames.length; i++) {
    fs.writeFile(`${diningHallNames[i]}.json`, JSON.stringify(diningHallInfo[i], null, 2), err => {
      if (err) {
        console.error(err);
      }
    });
  }
}

scrapeDiningHallInfo();

// scheduled to run at 12:01 AM CST
const scrapeJob = cron.schedule("0 1 0 * * *", () => {
  scrapeDiningHallInfo();
}, {
  timezone: "America/Chicago"
});

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

    res.json(JSON.parse(data.toString()));
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(fs.readFileSync('docs.json').toString())));

scrapeJob.start();
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});