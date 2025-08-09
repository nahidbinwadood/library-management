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
    try {
        const summary = yield borrow_model_1.default.aggregate([
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
                        title: '$bookDetails.title',
                        isbn: '$bookDetails.isbn',
                    },
                    totalQuantity: '$totalQuantity',
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: summary,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllBorrows = getAllBorrows;
