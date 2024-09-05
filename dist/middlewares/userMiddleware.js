"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
// Função de validação do corpo da requisição
const validateBody = (request, response, next) => {
    const { name, email } = request.body;
    const nameError = validateName(name);
    if (nameError) {
        response.status(400).json({ message: nameError });
    }
    const emailError = validateEmail(email);
    if (emailError) {
        response.status(400).json({ message: emailError });
    }
    // Se não houver erros, chama o next() para passar o controle para o próximo middleware ou rota
    next();
};
exports.validateBody = validateBody;
// Função de validação do nome
const validateName = (name) => {
    if (name === undefined || name.trim() === '') {
        return 'The "name" field is required and cannot be empty';
    }
    return null;
};
// Função de validação do e-mail
const validateEmail = (email) => {
    if (email === undefined || email.trim() === '') {
        return 'The "email" field is required and cannot be empty';
    }
    return null;
};
