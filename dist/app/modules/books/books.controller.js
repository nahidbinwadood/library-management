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
exports.updateBook = exports.getBookById = exports.getAllBooks = exports.deleteBook = exports.createBook = void 0;
const books_model_1 = require("./books.model");
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = Object.assign({}, req.body);
        if (payload.copies === 0) {
            payload.available = false;
        }
        const book = yield books_model_1.Books.create(payload);
        const responseData = {
            _id: book._id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            description: book.description,
            copies: book.copies,
            available: book.available,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
        };
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: responseData,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createBook = createBook;
const getAllBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter, sortBy, sort, limit = 10 } = req.query;
    try {
        // Build match stage for filtering
        const matchStage = {};
        if (filter) {
            matchStage.genre = filter;
        }
        // Build sort stage
        const sortStage = {};
        if (sortBy && sort) {
            const sortField = sortBy;
            const sortDirection = sort === 'desc' ? -1 : 1;
            sortStage[sortField] = sortDirection;
        }
        // Build aggregation pipeline
        const pipeline = [];
        // Add match stage if there are filters
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }
        // Add sort stage if specified
        if (Object.keys(sortStage).length > 0) {
            pipeline.push({ $sort: sortStage });
        }
        // Add limit stage
        pipeline.push({ $limit: parseInt(limit) });
        pipeline.push({
            $project: {
                _id: 1,
                title: 1,
                author: 1,
                genre: 1,
                isbn: 1,
                description: 1,
                copies: 1,
                available: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        });
        const response = yield books_model_1.Books.aggregate(pipeline);
        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllBooks = getAllBooks;
const getBookById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    try {
        const response = yield books_model_1.Books.findById(bookId);
        res.status(200).json({
            success: true,
            message: 'Book retrieved successfully',
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBookById = getBookById;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const payload = req.body;
    let updatedPayload = Object.assign({}, payload);
    if ((payload === null || payload === void 0 ? void 0 : payload.copies) > 0) {
        updatedPayload = Object.assign(Object.assign({}, payload), { available: true });
    }
    try {
        const response = yield books_model_1.Books.findByIdAndUpdate(bookId, Object.assign({}, updatedPayload), {
            new: true,
            runValidators: true,
            context: 'query',
        });
        res.status(201).json({
            success: true,
            message: 'Book updated successfully',
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    try {
        const deletedBook = yield books_model_1.Books.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBook = deleteBook;
