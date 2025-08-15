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
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if ([config_1.default.client_base_url, config_1.default.live_client_base_url].includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
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
