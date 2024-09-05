import { Request, Response, NextFunction } from 'express';
import { RequestBody } from '../interfaces/RequestBody.interface'

// Request body validation function
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

    // If there are no errors, call next() to pass control to the next middleware or route
    next();
};

// Name validation function
const validateName = (name: string | undefined): string | null => {
    if (name === undefined || name.trim() === '') {
        return 'The "name" field is required and cannot be empty';
    }
    return null;
};

// Email validation function
const validateEmail = (email: string | undefined): string | null => {
    if (email === undefined || email.trim() === '') {
        return 'The "email" field is required and cannot be empty';
    }
    return null;
};

// Exports the validation function
export {
    validateBody,
};
