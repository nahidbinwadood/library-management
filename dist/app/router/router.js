"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_route_1 = __importDefault(require("../modules/books/books.route"));
const borrow_api_1 = __importDefault(require("../modules/borrow/borrow.api"));
const router = express_1.default.Router();
router.use('/books', books_route_1.default);
router.use('/borrow', borrow_api_1.default);
exports.default = router;
