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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddress = exports.deleteAddress = exports.createAddress = exports.getAll = void 0;
const addressModel = __importStar(require("../models/addressModel")); // Ajuste a importação para TypeScript
// Controlador para obter todos os endereços
const getAll = (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield addressModel.getAll();
        return response.status(200).json({ address });
    }
    catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAll = getAll;
// Controlador para criar um novo endereço
const createAddress = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdAddress = yield addressModel.createAddress(request.body);
        return response.status(201).json(createdAddress);
    }
    catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
});
exports.createAddress = createAddress;
// Controlador para deletar um endereço
const deleteAddress = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        yield addressModel.deleteAddress(Number(id));
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteAddress = deleteAddress;
// Controlador para atualizar um endereço
const updateAddress = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        yield addressModel.updateAddress(Number(id), request.body);
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateAddress = updateAddress;
