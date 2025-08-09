"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMongooseError = void 0;
const handleMongooseError = (error) => {
    var _a, _b, _c;
    // Duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return {
            statusCode: 409,
            message: 'Validation failed',
            error: {
                name: 'DuplicateKeyError',
                message: `${field} must be unique`,
                keyValue: error.keyValue,
            },
        };
    }
    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const formattedErrors = {};
        for (const field in error.errors) {
            const err = error.errors[field];
            formattedErrors[field] = {
                message: err.message,
                name: err.name,
                properties: {
                    message: (_a = err.properties) === null || _a === void 0 ? void 0 : _a.message,
                    type: (_b = err.properties) === null || _b === void 0 ? void 0 : _b.type,
                    min: (_c = err.properties) === null || _c === void 0 ? void 0 : _c.min,
                },
                kind: err.kind,
                path: err.path,
                value: err.value,
            };
        }
        return {
            statusCode: 400,
            message: 'Validation failed',
            error: {
                name: 'ValidationError',
                errors: formattedErrors,
            },
        };
    }
    // custom api error=>
    if (error.name === 'ApiError') {
        return {
            statusCode: error.statusCode,
            message: error.message,
            error: {
                name: error.name,
                message: error.message,
            },
        };
    }
    // Default fallback
    return {
        statusCode: 500,
        message: 'Something went wrong',
        error: error,
    };
};
exports.handleMongooseError = handleMongooseError;
