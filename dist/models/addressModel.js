"use strict";
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
exports.updateAddress = exports.deleteAddress = exports.createAddress = exports.getAll = void 0;
// Supondo que você tenha uma configuração de conexão exportada
const connection_1 = __importDefault(require("./connection"));
// Função para obter todos os endereços
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const [address] = yield connection_1.default.execute('SELECT * FROM ADDRESS');
    return address;
});
exports.getAll = getAll;
// Função para criar um novo endereço
const createAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid, road, city, state, zipcode, country } = address;
    const dateUTC = new Date(Date.now()).toUTCString();
    const query = 'INSERT INTO ADDRESS (USERID, ROAD, CITY, STATE, ZIPCODE, COUNTRY, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
    // Execute a consulta
    const [result] = yield connection_1.default.execute(query, [userid, road, city, state, zipcode, country, dateUTC]);
    // Verificar e extrair insertId do resultado
    if ('insertId' in result) {
        return { insertId: result.insertId };
    }
    else {
        throw new Error('Failed to retrieve insertId from result');
    }
});
exports.createAddress = createAddress;
// Função para deletar um endereço
const deleteAddress = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_1.default.execute('DELETE FROM ADDRESS WHERE ADDRESSID = ?', [id]);
});
exports.deleteAddress = deleteAddress;
// Função para atualizar um endereço
const updateAddress = (id, address) => __awaiter(void 0, void 0, void 0, function* () {
    const { road, city, state, zipcode, country } = address;
    const query = 'UPDATE ADDRESS SET ROAD = ?, CITY = ?, STATE = ?, ZIPCODE = ?, COUNTRY = ? WHERE ADDRESSID = ?';
    yield connection_1.default.execute(query, [road, city, state, zipcode, country, id]);
});
exports.updateAddress = updateAddress;
