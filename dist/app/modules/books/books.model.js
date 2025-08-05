"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const mongoose_1 = require("mongoose");
const booksSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        enum: {
            values: [
                'FICTION',
                'NON_FICTION',
                'SCIENCE',
                'HISTORY',
                'BIOGRAPHY',
                'FANTASY',
            ],
            message: 'Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY',
        },
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true,
    },
    description: {
        type: String,
        default: '',
    },
    copies: {
        type: Number,
        required: [true, 'Copies is required'],
        min: [0, 'Copies must be a positive number'],
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.Books = (0, mongoose_1.model)('Books', booksSchema);
