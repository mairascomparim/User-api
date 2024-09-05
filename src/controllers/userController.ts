import { Request, Response } from 'express';
import * as userModel from '../models/userModel';
import jwt from 'jsonwebtoken';

const getAll = async (request: Request, response: Response): Promise<Response> => {
    const authHeader = request.headers['authorization'];    
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = decodeToken(token, 'liven');
    
    if (!decodedToken) {
        return response.status(401).json({ message: 'Invalid token' });
    }

    const users = await userModel.getAll(String(decodedToken));
    return response.status(200).json({ users });
};

const createUser = async (request: Request, response: Response): Promise<Response> => {
    const createdUser = await userModel.createUser(request.body);
    return response.status(201).json(createdUser);
};

const deleteUser = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;
    await userModel.deleteUser(Number(id));
    return response.status(204).json();
}

const updateUser = async (request: Request, response: Response): Promise<Response> => { 
    const { id } = request.params;
    await userModel.updateUser(Number(id), request.body);
    return response.status(204).json();
}

const loginUser = async (request: Request, response: Response): Promise<Response> => {
    const { email, password } = request.body;
    const result = await userModel.verifyPassword(email, password);

    if (!result.success) {
        return response.status(400).json({ message: result.message });
    }

    const token = jwt.sign(
        { id: result.user.USERID, email: result.user.EMAIL }, 
        'liven', 
        { expiresIn: '1h' }
    );

    return response.status(200).json({
        message: 'Successful login',
        token,
        user: {
            id: result.user.USERID,
            name: result.user.NAME,
            email: result.user.EMAIL
        }
    });
};   

function decodeToken(token: string | undefined, secretKey: string) {
    if (!token) {
        return { error: 'Token is required' };
    }

    try {
        return jwt.verify(token, secretKey) as { email: string };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export {
    getAll,
    createUser,
    deleteUser,
    updateUser,
    loginUser
};
