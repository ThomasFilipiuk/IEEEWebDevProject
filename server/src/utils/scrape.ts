import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { Category, MenuItem, Attribute, NutritionalInfo, Nutrient } from '../../interfaces/menuitems.interfaces';
import cron from 'node-cron';
import { updateOne } from '../database/utils';

const upsertMenuItem = async(menuItem: MenuItem) => {
  const filter = { name: menuItem.name };

  const update = { $setOnInsert: menuItem };

  const options = { upsert: true };

  const response = await updateOne(menuItem.diningHall, filter, update, options);

  console.log(response);
}

const mapNutritionalInfo = async(nutritionalInfoElements: ElementHandle[]) => {
  const nutritionalInfo = {};

  for (const nutritionalInfoElement of nutritionalInfoElements) {
    const menuItemName = await nutritionalInfoElement.$eval(".modal-title", e => e.textContent);
    if (!menuItemName) {
      continue;
    }
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

    const ingredients: string[] = [];
    
    const modalBody = await nutritionalInfoElement.$(".modal-body");
    const modalBodyDiv = await modalBody?.$("div");
    const ingredientsText = await modalBodyDiv?.$eval("div", e => e.textContent);
    const ingredientsTextTrimmed = ingredientsText?.trim();
    const ingredientsSplit = ingredientsTextTrimmed?.split(': ');
    if (ingredientsSplit) {
      const ingredientsUntrimmed = ingredientsSplit[1].split(',');


      for (const ingredient of ingredientsUntrimmed) {
        ingredients.push(ingredient.trim());
      }
    }

    await nutritionalInfoElement.evaluate(e => {
      const close = e.querySelector(".close");
      // @ts-ignore
      close.click();
    });
    
    // @ts-ignore
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
    // @ts-ignore
    await nutritionalInfoButton?.evaluate(e => e.click());
      
    await page.waitForSelector(".modal-content");

    const return_ob = {
      name: menuItemNameTrimmed,
      description: menuItemDescription,
      attributes: attributes,
      portion: portion,
      calories: calories,
      nutritionalInfo: {ingredients: [], nutrients: []}
    };

    // @ts-ignore
    return return_ob;

  }));
}

const mapCategories = async(categoriesElements: ElementHandle[], page: Page, diningHall: string, meal: string) => {
  for (const categoryElement of categoriesElements) {
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
      menuItem.diningHall = diningHall;
      menuItem.mealTime = meal;
      menuItem.category = categoryName;
      //insert to the db here
      await upsertMenuItem(menuItem);
      console.log(menuItem);
    }
  }
}

const scrapeCategories = async(page: Page, diningHall: string, meal: string) => {
  const querySelector = '.table.b-table.menu-items.b-table-caption-top.b-table-stacked-md';

  await page.waitForSelector(querySelector);

  const categories = await page.$$(querySelector);
  
  await mapCategories(categories, page, diningHall, meal);
}

const scrapeMeals = async(page: Page, diningHall: string) => {
  await page.waitForSelector(".nav.nav-tabs");

  const mealsList = await page.$(".nav.nav-tabs");

  const mealElements = await mealsList?.$$("a");
  
  if (mealElements) {
    for (const mealElement of mealElements) {
      const meal = await mealElement.evaluate(e => e.textContent);

      if (!meal) {
        continue;
      }

      await mealElement.evaluate(e => e.click());

      // @ts-ignore
      await scrapeCategories(page, diningHall, meal);
      // don't need to store and return meals obj anymore
    }
  }
}

const scrapeDiningHallInfo = async() => {
  const browser = await puppeteer.launch()

  const page = await browser.newPage();

  await page.goto('https://dineoncampus.com/northwestern/whats-on-the-menu', {timeout: 0});

  const diningHallNames = ["allison", "sargent", "plex-west", "plex-east", "elder"];
  await scrapeMeals(page, "allison");

  page.click("#dropdown-grouped__BV_toggle_");
  page.waitForSelector("[aria-describedby=building_6113ef5ae82971150a5bf8ba]");
  const dropdownItems = await page.$$("[aria-describedby=building_6113ef5ae82971150a5bf8ba]");
  for (let i = 1; i <= 4; i++) {
    // @ts-ignore
    dropdownItems[i].evaluate(e => e.click());
    await scrapeMeals(page, diningHallNames[i]);
  }
}

// scheduled to run at 12:01 AM CST
const scrapeJob = cron.schedule("0 1 0 * * *", () => {
  scrapeDiningHallInfo();
}, {
  timezone: "America/Chicago"
});

export default scrapeJob;