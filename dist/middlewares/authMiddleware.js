"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Função de autenticação do token
const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!token) {
        response.status(401).json({ message: 'Token not found' });
    }
    jsonwebtoken_1.default.verify(String(token), 'liven', (err, user) => {
        if (err) {
            return response.status(403).json({ message: 'Invalid token' });
        }
        request.user = user;
        next();
    });
};
exports.default = authenticateToken;
