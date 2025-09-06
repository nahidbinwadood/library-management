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
exports.updateBook = exports.getBookById = exports.getAllBooksDemo = exports.getAllBooks = exports.deleteBook = exports.createBook = void 0;
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
    var _a, _b, _c, _d;
    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', page = 1, limit = 10, search, // optional free text search
         } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        // Filtering
        const matchStage = {};
        if (filter && filter != 'all') {
            matchStage.genre = filter;
        }
        if (search) {
            matchStage.title = { $regex: search, $options: 'i' };
        }
        // Sorting
        const sortStage = {
            [sortBy]: sort === 'desc' ? -1 : 1,
        };
        // Aggregation pipeline
        const pipeline = [];
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }
        // Facet for data + count
        pipeline.push({
            $facet: {
                data: [
                    { $sort: sortStage },
                    { $skip: skip },
                    { $limit: limitNum },
                    {
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
                    },
                ],
                totalCount: [{ $count: 'count' }],
            },
        });
        const result = yield books_model_1.Books.aggregate(pipeline);
        const books = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_d = (_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalCount) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
        const totalPages = Math.ceil(total / limitNum);
        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
            pagination: {
                total,
                totalPages,
                currentPage: pageNum,
                pageSize: limitNum,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllBooks = getAllBooks;
const getAllBooksDemo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield books_model_1.Books.find();
        console.log(response);
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
exports.getAllBooksDemo = getAllBooksDemo;
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
