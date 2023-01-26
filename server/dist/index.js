"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const puppeteer_1 = __importDefault(require("puppeteer"));
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
        const categories = await page.evaluate((querySelector) => {
            const mapMenuItems = (menuItemElem) => {
                var _a, _b, _c, _d;
                const menuItemWrapper = menuItemElem.querySelector('.category-items_itemNameWrapperSm_1wGbS');
                const menuItemName = (_b = (_a = menuItemWrapper === null || menuItemWrapper === void 0 ? void 0 : menuItemWrapper.querySelector('strong')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                const textNodes = Array.prototype.filter.call(menuItemWrapper === null || menuItemWrapper === void 0 ? void 0 : menuItemWrapper.childNodes, e => e.nodeType === Node.TEXT_NODE)
                    .map(e => e.textContent);
                const menuItemDescription = textNodes[0].trim();
                const attributes = Array.from(menuItemElem.querySelectorAll('.category-items_icon_1urJ3'), e => e.src);
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
            return Array.from(document.querySelectorAll(querySelector), mapCategories);
        }, querySelector);
        // console.log(JSON.stringify(categories));
        fs_1.default.writeFile('allison.json', JSON.stringify(categories), err => {
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
        res.json(JSON.parse(data.toString()));
    });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
