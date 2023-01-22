"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const puppeteer_1 = __importDefault(require("puppeteer"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get('/', (req, res) => {
    const p = () => __awaiter(void 0, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto('https://dineoncampus.com/northwestern/whats-on-the-menu', { timeout: 0 });
        const querySelector = '.table.b-table.menu-items.b-table-caption-top.b-table-stacked-md';
        yield page.waitForSelector(querySelector);
        const html = yield page.evaluate(() => Array.from(document.querySelectorAll('.table.b-table.menu-items.b-table-caption-top.b-table-stacked-md'), elem => elem.textContent));
        console.log(html);
        yield browser.close();
    });
    p();
    res.send("Hi");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
