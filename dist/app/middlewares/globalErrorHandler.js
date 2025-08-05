"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const handleMongooseError_1 = require("../errors/handleMongooseError");
const globalErrorHandler = (error, req, res, next) => {
    const { statusCode, message, error: formattedError, } = (0, handleMongooseError_1.handleMongooseError)(error);
    res.status(statusCode).json({
        success: false,
        message,
        error: formattedError,
    });
};
exports.globalErrorHandler = globalErrorHandler;
