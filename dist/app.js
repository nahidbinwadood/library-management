"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./app/config"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const router_1 = __importDefault(require("./app/router/router"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        config_1.default.client_base_url,
        `http://localhost:${config_1.default.port}`,
        `http://192.168.0.160:${config_1.default.port}`,
    ],
    credentials: true,
};
// parser:
app.use((0, cors_1.default)(corsOptions));
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
