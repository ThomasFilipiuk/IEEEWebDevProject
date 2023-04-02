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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
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
        //query the mongo database here
    });
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(JSON.parse(fs_1.default.readFileSync('docs.json').toString())));
scrape_1.default.start();
console.log('scrape task scheduled');
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
app.get('/dining-hall/:reviews', (req, res) => {
});
