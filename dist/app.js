"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const router_1 = __importDefault(require("./app/router/router"));
const app = (0, express_1.default)();
// parser:
app.use(express_1.default.json());
// routes==>
app.use('/api', router_1.default);
// test api==>
app.get('/', (req, res) => {
    res.json({
        message: 'The server is running !',
    });
});
// middlewares=>
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
