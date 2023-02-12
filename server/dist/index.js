"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const node_cron_1 = __importDefault(require("node-cron"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const mapNutritionalInfo = async (nutritionalInfoElements) => {
    const nutritionalInfo = {};
    for (const nutritionalInfoElement of nutritionalInfoElements) {
        const menuItemName = await nutritionalInfoElement.$eval(".modal-title", e => e.textContent);
        const nutrientElements = await nutritionalInfoElement.$$("li");
        const nutrients = [];
        for (const nutrientElement of nutrientElements) {
            const nutrientText = await nutrientElement.evaluate(e => e.textContent);
            const nutrientTrimmed = nutrientText === null || nutrientText === void 0 ? void 0 : nutrientText.trim();
            const nutrient = nutrientTrimmed === null || nutrientTrimmed === void 0 ? void 0 : nutrientTrimmed.split(': ');
            if (nutrient) {
                nutrients.push({
                    name: nutrient[0],
                    value: nutrient[1].trim()
                });
            }
        }
        const modalBody = await nutritionalInfoElement.$(".modal-body");
        const modalBodyDiv = await (modalBody === null || modalBody === void 0 ? void 0 : modalBody.$("div"));
        const ingredientsText = await (modalBodyDiv === null || modalBodyDiv === void 0 ? void 0 : modalBodyDiv.$eval("div", e => e.textContent));
        const ingredientsTextTrimmed = ingredientsText === null || ingredientsText === void 0 ? void 0 : ingredientsText.trim();
        const ingredientsSplit = ingredientsTextTrimmed === null || ingredientsTextTrimmed === void 0 ? void 0 : ingredientsTextTrimmed.split(': ');
        const ingredientsUntrimmed = ingredientsSplit[1].split(',');
        const ingredients = [];
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
};
const mapAttributes = async (attributeElements) => {
    return Promise.all(attributeElements.map(async (attributeElement) => {
        const attributes = {
            "https://dineoncampus.com/img/icon_balanced_200px.png": { name: "Balanced", description: "Food that has balanced nutrients & portion size." },
            "https://dineoncampus.com/img/icon_vegan_200px.png": { name: "Vegan", description: "Contains no animal-based ingredients or by-products." },
            "https://dineoncampus.com/img/icon_vegetarian_200px.png": { name: "Vegetarian", description: "Contains no meat, poultry, fish or seafood but may contain eggs or dairy." },
            "https://dineoncampus.com/img/icon_avoiding_gluten_200px.png": { name: "Gluten-free", description: "Menu items made without gluten containing ingredients." },
            "https://dineoncampus.com/img/howgood-best.png": { name: "Best", description: "Recipe has an environmental and social impact better than 95% of food." },
            "https://dineoncampus.com/img/howgood-great.png": { name: "Great", description: "Recipe has an environmental and social impact better than 85% of food." },
            "https://dineoncampus.com/img/howgood-good.png": { name: "Good", description: "Recipe has an environmental and social impact better than 75% of food." },
            "https://dineoncampus.com/img/howgood-climate-friendly.png": { name: "Climate friendly", description: "This recipe has a Farm-To-Gate Carbon Footprint lower than 70% of conventional food at large." }
        };
        // mapping src of img to name and description
        // @ts-ignore
        const attributeSrc = await attributeElement.evaluate(e => e.src);
        return attributes[attributeSrc];
    }));
};
const mapMenuItems = async (menuItemsElements, page) => {
    return await Promise.all(menuItemsElements.map(async (menuItemElement) => {
        const menuItemWrapper = await menuItemElement.$('.category-items_itemNameWrapperSm_1wGbS');
        const menuItemName = await (menuItemWrapper === null || menuItemWrapper === void 0 ? void 0 : menuItemWrapper.$eval('strong', e => e.textContent));
        let menuItemNameTrimmed = menuItemName === null || menuItemName === void 0 ? void 0 : menuItemName.trim();
        if (!menuItemNameTrimmed) {
            menuItemNameTrimmed = "";
        }
        const textNodes = await (menuItemWrapper === null || menuItemWrapper === void 0 ? void 0 : menuItemWrapper.evaluate(element => {
            return Array.prototype.filter.call(element.childNodes, e => e.nodeType === Node.TEXT_NODE).map(node => node.textContent);
        }));
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
        const nutritionalInfoButton = await (menuItemWrapper === null || menuItemWrapper === void 0 ? void 0 : menuItemWrapper.$(".btn.mt-3.btn-nutrition.btn-info-outline.btn-sm"));
        await (nutritionalInfoButton === null || nutritionalInfoButton === void 0 ? void 0 : nutritionalInfoButton.evaluate(e => e.click()));
        await page.waitForSelector(".modal-content");
        return {
            name: menuItemNameTrimmed,
            description: menuItemDescription,
            attributes: attributes,
            portion: portion,
            calories: calories,
            nutritionalInfo: { ingredients: [], nutrients: [] }
        };
    }));
};
const mapCategories = async (categoriesElements, page) => {
    return await Promise.all(categoriesElements.map(async (categoryElement) => {
        let categoryName = await categoryElement.$eval('caption', e => e.textContent);
        if (!categoryName) {
            categoryName = "";
        }
        const tableBody = await categoryElement.$('tbody');
        const menuItemsElements = await (tableBody === null || tableBody === void 0 ? void 0 : tableBody.$$('tr'));
        let menuItems = [];
        if (menuItemsElements) {
            menuItems = await mapMenuItems(menuItemsElements, page);
        }
        const nutritionalInfoElements = await page.$$(".modal-content");
        const nutritionalInfoObj = await mapNutritionalInfo(nutritionalInfoElements);
        await page.waitForSelector("#nutritional-modal-61f477db8f3eb63e48343c03-63e888d4c625af07221997ca___BV_modal_outer_", { hidden: true });
        for (const menuItem of menuItems) {
            menuItem.nutritionalInfo = nutritionalInfoObj[menuItem.name];
        }
        return {
            name: categoryName,
            menuItems: menuItems
        };
    }));
};
const scrapeCategories = async (page) => {
    const querySelector = '.table.b-table.menu-items.b-table-caption-top.b-table-stacked-md';
    await page.waitForSelector(querySelector);
    const categories = await page.$$(querySelector);
    return await mapCategories(categories, page);
};
const scrapeDiningHallInfo = async () => {
    const browser = await puppeteer_1.default.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://dineoncampus.com/northwestern/whats-on-the-menu', { timeout: 0 });
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
        fs_1.default.writeFile(`${diningHallNames[i]}.json`, JSON.stringify(diningHallInfo[i], null, 2), err => {
            if (err) {
                console.error(err);
            }
        });
    }
};
scrapeDiningHallInfo();
// scheduled to run at 12:01 AM CST
const scrapeJob = node_cron_1.default.schedule("0 1 0 * * *", () => {
    console.log("shit");
}, {
    timezone: "America/Chicago"
});
app.get('/', (req, res) => {
    const p = async () => {
        const browser = await puppeteer_1.default.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://dineoncampus.com/northwestern/whats-on-the-menu', { timeout: 0 });
        const querySelector = '.table.b-table.menu-items.b-table-caption-top.b-table-stacked-md';
        await page.waitForSelector(querySelector);
        const allisonCategories = await page.evaluate((querySelector) => {
            const mapAttributes = (attributeElem) => {
                const attributes = {
                    "https://dineoncampus.com/img/icon_balanced_200px.png": { name: "Balanced", description: "Food that has balanced nutrients & portion size." },
                    "https://dineoncampus.com/img/icon_vegan_200px.png": { name: "Vegan", description: "Contains no animal-based ingredients or by-products." },
                    "https://dineoncampus.com/img/icon_vegetarian_200px.png": { name: "Vegetarian", description: "Contains no meat, poultry, fish or seafood but may contain eggs or dairy." },
                    "https://dineoncampus.com/img/icon_avoiding_gluten_200px.png": { name: "Gluten-free", description: "Menu items made without gluten containing ingredients." },
                    "https://dineoncampus.com/img/howgood-best.png": { name: "Best", description: "Recipe has an environmental and social impact better than 95% of food." },
                    "https://dineoncampus.com/img/howgood-great.png": { name: "Great", description: "Recipe has an environmental and social impact better than 85% of food." },
                    "https://dineoncampus.com/img/howgood-good.png": { name: "Good", description: "Recipe has an environmental and social impact better than 75% of food." },
                    "https://dineoncampus.com/img/howgood-climate-friendly.png": { name: "Climate friendly", description: "This recipe has a Farm-To-Gate Carbon Footprint lower than 70% of conventional food at large." }
                };
                // mapping src of img to name and description
                return attributes[attributeElem.src];
            };
            const mapMenuItems = (menuItemElem) => {
                var _a, _b, _c, _d;
                const menuItemWrapper = menuItemElem.querySelector('.category-items_itemNameWrapperSm_1wGbS');
                const menuItemName = (_b = (_a = menuItemWrapper === null || menuItemWrapper === void 0 ? void 0 : menuItemWrapper.querySelector('strong')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                const textNodes = Array.prototype.filter.call(menuItemWrapper === null || menuItemWrapper === void 0 ? void 0 : menuItemWrapper.childNodes, e => e.nodeType === Node.TEXT_NODE)
                    .map(e => e.textContent);
                const menuItemDescription = textNodes[0].trim();
                const attributes = Array.from(menuItemElem.querySelectorAll('.category-items_icon_1urJ3'), mapAttributes);
                // make map function that splits src by '_' and gets attribute
                const portion = (_c = menuItemElem.querySelector('[data-label=Portion]')) === null || _c === void 0 ? void 0 : _c.textContent;
                const calories = (_d = menuItemElem.querySelector('[data-label=Calories]')) === null || _d === void 0 ? void 0 : _d.textContent;
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
            };
            const mapCategories = (categoryElem) => {
                var _a;
                const categoryName = (_a = categoryElem.querySelector('caption')) === null || _a === void 0 ? void 0 : _a.textContent;
                const tableBody = categoryElem.querySelector('tbody');
                const menuItems = Array.from(tableBody.querySelectorAll('tr'), mapMenuItems);
                return {
                    name: categoryName,
                    menuItems: menuItems
                };
            };
            // returns array of categories
            return Array.from(document.querySelectorAll(querySelector), mapCategories); // querySelector = class name of all tables
            // select all tables from the page
        }, querySelector);
        page.click("#dropdown-grouped__BV_toggle_");
        page.waitForSelector("[aria-describedby=building_6113ef5ae82971150a5bf8ba]");
        // await page.evaluate(() => {
        //   const dropdownItems = Array.from(document.querySelectorAll('[aria-describedby=building_6113ef5ae82971150a5bf8ba]'));
        //   dropdownItems[1].click();
        // });
        const dropdownItems = await page.$$("[aria-describedby=building_6113ef5ae82971150a5bf8ba]");
        await dropdownItems[1].click();
        await page.waitForSelector(querySelector);
        const sargentCategories = await page.evaluate((querySelector) => {
            const mapAttributes = (attributeElem) => {
                const attributes = {
                    "https://dineoncampus.com/img/icon_balanced_200px.png": { name: "Balanced", description: "Food that has balanced nutrients & portion size." },
                    "https://dineoncampus.com/img/icon_vegan_200px.png": { name: "Vegan", description: "Contains no animal-based ingredients or by-products." },
                    "https://dineoncampus.com/img/icon_vegetarian_200px.png": { name: "Vegetarian", description: "Contains no meat, poultry, fish or seafood but may contain eggs or dairy." },
                    "https://dineoncampus.com/img/icon_avoiding_gluten_200px.png": { name: "Gluten-free", description: "Menu items made without gluten containing ingredients." },
                    "https://dineoncampus.com/img/howgood-best.png": { name: "Best", description: "Recipe has an environmental and social impact better than 95% of food." },
                    "https://dineoncampus.com/img/howgood-great.png": { name: "Great", description: "Recipe has an environmental and social impact better than 85% of food." },
                    "https://dineoncampus.com/img/howgood-good.png": { name: "Good", description: "Recipe has an environmental and social impact better than 75% of food." },
                    "https://dineoncampus.com/img/howgood-climate-friendly.png": { name: "Climate friendly", description: "This recipe has a Farm-To-Gate Carbon Footprint lower than 70% of conventional food at large." }
                };
                // mapping src of img to name and description
                return attributes[attributeElem.src];
            };
            const mapMenuItems = (menuItemElem) => {
                var _a, _b, _c, _d;
                const menuItemWrapper = menuItemElem.querySelector('.category-items_itemNameWrapperSm_1wGbS');
                const menuItemName = (_b = (_a = menuItemWrapper === null || menuItemWrapper === void 0 ? void 0 : menuItemWrapper.querySelector('strong')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                const textNodes = Array.prototype.filter.call(menuItemWrapper === null || menuItemWrapper === void 0 ? void 0 : menuItemWrapper.childNodes, e => e.nodeType === Node.TEXT_NODE)
                    .map(e => e.textContent);
                const menuItemDescription = textNodes[0].trim();
                const attributes = Array.from(menuItemElem.querySelectorAll('.category-items_icon_1urJ3'), mapAttributes);
                const portion = (_c = menuItemElem.querySelector('[data-label=Portion]')) === null || _c === void 0 ? void 0 : _c.textContent;
                const calories = (_d = menuItemElem.querySelector('[data-label=Calories]')) === null || _d === void 0 ? void 0 : _d.textContent;
                // const nutritionalInfoButton = menuItemElem.querySelector('button');
                // console.log(nutritionalInfoButton?.textContent);
                // nutritionalInfoButton?.click();
                return {
                    name: menuItemName,
                    description: menuItemDescription,
                    attributes: attributes,
                    portion: portion,
                    calories: calories,
                    // nutritionalInfo: nutritionalInfo
                };
            };
            const mapCategories = (categoryElem) => {
                var _a;
                const categoryName = (_a = categoryElem.querySelector('caption')) === null || _a === void 0 ? void 0 : _a.textContent;
                const tableBody = categoryElem.querySelector('tbody');
                const menuItems = Array.from(tableBody.querySelectorAll('tr'), mapMenuItems);
                return {
                    name: categoryName,
                    menuItems: menuItems
                };
            };
            // returns array of categories
            return Array.from(document.querySelectorAll(querySelector), mapCategories); // querySelector = class name of all tables
            // select all tables from the page
        }, querySelector);
        console.log("finished scraping");
        fs_1.default.writeFile('allison.json', JSON.stringify(allisonCategories, null, 2), err => {
            if (err) {
                console.error(err);
            }
        });
        fs_1.default.writeFile('sargent.json', JSON.stringify(sargentCategories, null, 2), err => {
            if (err) {
                console.error(err);
            }
        });
        await browser.close();
    };
    p();
    res.send("Scraping web data");
});
app.get('/dining-hall/:diningHallName', (req, res) => {
    fs_1.default.readFile(`${req.params.diningHallName}.json`, (err, data) => {
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
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(JSON.parse(fs_1.default.readFileSync('docs.json').toString())));
scrapeJob.start();
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
