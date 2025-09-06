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
exports.getAllBorrows = exports.borrowABook = void 0;
const borrow_model_1 = __importDefault(require("./borrow.model"));
const borrowABook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payloads = req.body;
    try {
        const borrow = new borrow_model_1.default(payloads);
        const response = yield borrow.save();
        // const response = await Borrow.create(payloads);
        const modifiedData = {
            _id: response.id,
            book: payloads.book,
            quantity: payloads.quantity,
            dueDate: payloads.dueDate,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
        };
        if (response) {
            res.status(201).json({
                success: true,
                message: 'Book borrowed successfully',
                data: modifiedData,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.borrowABook = borrowABook;
const getAllBorrows = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { sortBy = 'totalQuantity', // default: sort by most borrowed
        sort = 'desc', page = 1, limit = 10, } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        // Sorting
        const sortStage = {
            [sortBy]: sort === 'desc' ? -1 : 1,
        };
        // Main aggregation
        const pipeline = [
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails',
                },
            },
            { $unwind: '$bookDetails' },
            {
                $project: {
                    _id: 0,
                    book: {
                        id: '$bookDetails._id',
                        title: '$bookDetails.title',
                        isbn: '$bookDetails.isbn',
                    },
                    totalQuantity: 1,
                },
            },
            {
                $facet: {
                    data: [{ $sort: sortStage }, { $skip: skip }, { $limit: limitNum }],
                    totalCount: [{ $count: 'count' }],
                    stats: [
                        {
                            $group: {
                                _id: null,
                                uniqueTitlesBorrowed: { $sum: 1 },
                                totalBorrowedCopies: { $sum: '$totalQuantity' },
                                averageCopiesPerBook: { $avg: '$totalQuantity' },
                            },
                        },
                    ],
                },
            },
        ];
        const result = yield borrow_model_1.default.aggregate(pipeline);
        const data = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_d = (_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalCount) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
        const totalPages = Math.ceil(total / limitNum);
        // extract stats
        const statsAgg = ((_f = (_e = result[0]) === null || _e === void 0 ? void 0 : _e.stats) === null || _f === void 0 ? void 0 : _f[0]) || {};
        let mostPopularBook = null;
        let mostPopularBookCopies = null;
        // 🔥 find most popular book with its total copies
        const popular = yield borrow_model_1.default.aggregate([
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails',
                },
            },
            { $unwind: '$bookDetails' },
            {
                $project: {
                    title: '$bookDetails.title',
                    totalQuantity: 1,
                },
            },
        ]);
        if (popular.length > 0) {
            mostPopularBook = popular[0].title;
            mostPopularBookCopies = popular[0].totalQuantity;
        }
        res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data,
            pagination: {
                total,
                totalPages,
                currentPage: pageNum,
                pageSize: limitNum,
            },
            stats: {
                uniqueTitlesBorrowed: statsAgg.uniqueTitlesBorrowed || 0,
                totalBorrowedCopies: statsAgg.totalBorrowedCopies || 0,
                averageCopiesPerBook: Math.floor(statsAgg.averageCopiesPerBook || 0),
                mostPopularBook,
                mostPopularBookCopies,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllBorrows = getAllBorrows;
