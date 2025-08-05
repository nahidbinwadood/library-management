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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBooks = exports.createBook = void 0;
const books_model_1 = require("./books.model");
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    try {
        const response = yield books_model_1.Books.create(payload);
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createBook = createBook;
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield books_model_1.Books.find();
        res.status(201).json({
            success: true,
            message: 'Books retrieved successfully',
            data: response,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            error,
        });
    }
});
exports.getAllBooks = getAllBooks;
