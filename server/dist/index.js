"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get('/', (req, res) => {
    const p = async () => {
        const browser = await puppeteer_1.default.launch();
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
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
