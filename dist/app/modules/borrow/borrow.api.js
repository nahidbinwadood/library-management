"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const borrow_controller_1 = require("./borrow.controller");
const borrowRoutes = (0, express_1.Router)();
borrowRoutes.post('/', borrow_controller_1.borrowABook);
borrowRoutes.get('/', borrow_controller_1.getAllBorrows);
exports.default = borrowRoutes;
