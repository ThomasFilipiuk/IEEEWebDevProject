"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const scrape_1 = __importDefault(require("./src/utils/scrape"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./src/database/utils");
const cors_1 = __importDefault(require("cors"));
var bodyParser = require('body-parser');
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const db_name = process.env.MONGODB_DB_NAME;
app.use(bodyParser.json());
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
app.get('/dining-hall/:diningHallName', (req, res) => {
    const diningHall = req.params.diningHallName;
    fs_1.default.readFile(`${diningHall}.json`, async (err, data) => {
        if (err) {
            res.status(404).json({ error: "dining hall not found" });
            return;
        }
        if (data.length === 0) {
            res.status(404).json({ error: "dining hall not found" });
            return;
        }
        const result = await (0, utils_1.find)(diningHall, { "diningHall": req.params.diningHallName });
        res.send(result);
    });
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(JSON.parse(fs_1.default.readFileSync('docs.json').toString())));
scrape_1.default.start();
app.listen((port), () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
//enter a review into the database
app.post('/reviews', async (req, res) => {
    try {
        const review_ob = req.body;
        const result = await (0, utils_1.insertOne)("reviews", review_ob);
        res.send(result);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
});
//retrieve all the reviews for a dininghall from the database
app.get('/reviews/:diningHallName', async (req, res) => {
    try {
        const result = await (0, utils_1.find)('reviews', { "diningHall": req.params.diningHallName });
        res.send(result);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
});
//send the metadata for a dining hall
app.get('/metaData/:diningHallName', async (req, res) => {
    try {
        const diningHall = req.params.diningHallName;
        //topItem, avgRating = await find_top_item(diningHall);
        const topItem = await (0, utils_1.findTopRating)("reviews", diningHall);
        const avgRating = await (0, utils_1.findAverageRating)("reviews", diningHall);
        const imageLink = "image link";
        res.json({ "diningHall": diningHall,
            "topItem": topItem,
            "avgRating": avgRating,
            "imageLink": imageLink
        });
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
});
//implement databases for daily items
