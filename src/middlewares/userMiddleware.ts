import { Request, Response, NextFunction } from 'express';

interface RequestBody {
    name?: string;
    email?: string;
}

// Função de validação do corpo da requisição
const validateBody = (request: Request<{}, {}, RequestBody>, response: Response, next: NextFunction): void => {
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

// Função de validação do nome
const validateName = (name: string | undefined): string | null => {
    if (name === undefined || name.trim() === '') {
        return 'The "name" field is required and cannot be empty';
    }
    return null;
};

// Função de validação do e-mail
const validateEmail = (email: string | undefined): string | null => {
    if (email === undefined || email.trim() === '') {
        return 'The "email" field is required and cannot be empty';
    }
    return null;
};

// Exporta a função de validação
export {
    validateBody,
};
