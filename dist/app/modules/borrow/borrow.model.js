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
const mongoose_1 = require("mongoose");
const api_error_1 = require("../../errors/api-error");
const books_model_1 = require("../books/books.model");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Book Id is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity must be a positive number'],
    },
    dueDate: {
        type: String,
        required: [true, 'Due Date is required'],
    },
}, {
    versionKey: false,
    timestamps: true,
});
// static methods=>
borrowSchema.statics.validateBorrow = function (borrowDoc) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestedId = borrowDoc.book;
        const requestedQuantity = borrowDoc.quantity;
        const requestedBookDetails = yield books_model_1.Books.findById(requestedId);
        if (!requestedBookDetails) {
            throw new api_error_1.ApiError(400, 'Book not found');
        }
        if (!(requestedBookDetails === null || requestedBookDetails === void 0 ? void 0 : requestedBookDetails.available)) {
            throw new api_error_1.ApiError(400, 'This book is not available for borrow');
        }
        if (requestedBookDetails.copies < requestedQuantity) {
            throw new api_error_1.ApiError(400, 'Requested copies not available');
        }
    });
};
borrowSchema.statics.updateBookAfterBorrow = function (borrowDoc) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestedBookId = borrowDoc.book;
        const requestedQuantity = borrowDoc.quantity;
        const requestedBookDetails = yield books_model_1.Books.findById(requestedBookId);
        let updatedPayload = {
            copies: 0,
            available: true,
        };
        if (requestedBookDetails) {
            const updatedQuantity = (requestedBookDetails === null || requestedBookDetails === void 0 ? void 0 : requestedBookDetails.copies) - requestedQuantity;
            if (updatedQuantity == 0) {
                updatedPayload.available = false;
                updatedPayload.copies = updatedQuantity;
                yield books_model_1.Books.findByIdAndUpdate(requestedBookId, updatedPayload);
            }
            else {
                updatedPayload.available = true;
                updatedPayload.copies = updatedQuantity;
                yield books_model_1.Books.findByIdAndUpdate(requestedBookId, updatedPayload);
            }
        }
    });
};
// middlewares==>
borrowSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const model = this.constructor;
            yield model.validateBorrow(this);
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
borrowSchema.post('save', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const model = doc.constructor;
            yield model.updateBookAfterBorrow(doc);
        }
        catch (error) {
            console.error(error);
        }
    });
});
const Borrow = (0, mongoose_1.model)('Borrow', borrowSchema);
exports.default = Borrow;
