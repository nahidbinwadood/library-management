"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseData = void 0;
const ResponseData = (data) => {
    var _a, _b;
    return Object.assign(Object.assign({}, data.toObject()), { _id: data._id.toString(), createdAt: (_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(), updatedAt: (_b = data.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString() });
};
exports.ResponseData = ResponseData;
