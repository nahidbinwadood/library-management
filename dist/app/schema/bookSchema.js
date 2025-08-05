"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksZodSchema = void 0;
const zod_1 = require("zod");
exports.booksZodSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.string(),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().min(1, 'Copies must be a positive number'),
    available: zod_1.z.boolean(),
});
