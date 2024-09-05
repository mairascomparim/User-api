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
exports.verifyPassword = exports.getUserByEmail = exports.updateUser = exports.deleteUser = exports.createUser = exports.getAll = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = __importDefault(require("./connection"));
const getAll = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      SELECT U.USERID, U.NAME, U.EMAIL, A.ROAD, A.CITY, A.STATE, A.ZIPCODE, A.COUNTRY 
      FROM USER U INNER JOIN ADDRESS A ON U.USERID = A.USERID WHERE U.EMAIL = ? 
    `;
    // Execute a consulta e desestruture o resultado
    const [rows] = yield connection_1.default.execute(query, [email]);
    // Transforme o resultado em um formato de User agrupado por USERID
    const groupedData = rows.reduce((acc, row) => {
        if (!acc[row.USERID]) {
            acc[row.USERID] = {
                USERID: row.USERID,
                NAME: row.NAME,
                EMAIL: row.EMAIL,
                ADDRESSES: [],
            };
        }
        acc[row.USERID].ADDRESSES.push({
            ROAD: row.ROAD,
            CITY: row.CITY,
            STATE: row.STATE,
            ZIPCODE: row.ZIPCODE,
            COUNTRY: row.COUNTRY,
        });
        return acc;
    }, {});
    return Object.values(groupedData);
});
exports.getAll = getAll;
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, password }) {
    const createdAt = new Date().toISOString();
    const query = `
      INSERT INTO USER (NAME, EMAIL, PASSWORD, created_at) 
      VALUES (?, ?, ?, ?)
    `;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hash = yield bcrypt_1.default.hash(password, salt);
    // Execute a consulta e desestruture o resultado
    const [result] = yield connection_1.default.execute(query, [name, email, hash, createdAt]);
    // O resultado pode ser um array, então você precisa acessar a propriedade corretamente
    const insertId = result.insertId;
    if (insertId !== undefined) {
        return { insertId };
    }
    else {
        throw new Error('Failed to get insertId from result');
    }
});
exports.createUser = createUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [removedUser] = yield connection_1.default.execute('DELETE FROM USER WHERE USERID = ?', [id]);
    return removedUser;
});
exports.deleteUser = deleteUser;
const updateUser = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = user;
    const query = 'UPDATE USER SET NAME = ?, EMAIL = ? WHERE USERID = ?';
    const updatedUser = yield connection_1.default.execute(query, [name, email, id]);
    return updatedUser;
});
exports.updateUser = updateUser;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT NAME, EMAIL, PASSWORD FROM USER WHERE EMAIL = ?';
    const [users] = yield connection_1.default.execute(query, [email]);
    return users;
});
exports.getUserByEmail = getUserByEmail;
const verifyPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserByEmail(email);
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.PASSWORD);
    if (!isMatch) {
        return { success: false, message: 'Incorrect password' };
    }
    return { success: true, message: 'Correct password', user };
});
exports.verifyPassword = verifyPassword;
