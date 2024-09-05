"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.updateUser = exports.deleteUser = exports.createUser = exports.getAll = void 0;
const userModel = __importStar(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAll = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = decodeToken(token, 'liven');
    if (!decodedToken) {
        return response.status(401).json({ message: 'Invalid token' });
    }
    const users = yield userModel.getAll(String(decodedToken));
    return response.status(200).json({ users });
});
exports.getAll = getAll;
const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield userModel.createUser(request.body);
    return response.status(201).json(createdUser);
});
exports.createUser = createUser;
const deleteUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    yield userModel.deleteUser(Number(id));
    return response.status(204).json();
});
exports.deleteUser = deleteUser;
const updateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    yield userModel.updateUser(Number(id), request.body);
    return response.status(204).json();
});
exports.updateUser = updateUser;
const loginUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const result = yield userModel.verifyPassword(email, password);
    if (!result.success) {
        return response.status(400).json({ message: result.message });
    }
    const token = jsonwebtoken_1.default.sign({ id: result.user.USERID, email: result.user.EMAIL }, 'liven', { expiresIn: '1h' });
    return response.status(200).json({
        message: 'Successful login',
        token,
        user: {
            id: result.user.USERID,
            name: result.user.NAME,
            email: result.user.EMAIL
        }
    });
});
exports.loginUser = loginUser;
function decodeToken(token, secretKey) {
    if (!token) {
        return { error: 'Token is required' };
    }
    try {
        return jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        return { error: error.message };
    }
}
