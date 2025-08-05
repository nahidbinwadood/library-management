"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_controller_1 = require("./books.controller");
const booksRoutes = (0, express_1.Router)();
booksRoutes.get('/', books_controller_1.getAllBooks);
booksRoutes.post('/', books_controller_1.createBook);
exports.default = booksRoutes;
