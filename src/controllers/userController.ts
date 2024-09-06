import { Request, Response } from 'express';
import * as userModel from '../models/userModel';
import { JWTUser } from '../interfaces/JWTUser.interface'
import jwt from 'jsonwebtoken';

const getUserFromJWT = async (request: Request) =>{
    const authHeader = request.headers['authorization'];    
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = decodeToken(token, 'liven');
    
    return decodedToken;    
}

const getAll = async (request: Request, response: Response): Promise<Response> => {    
    const decodedToken = await getUserFromJWT(request);

    if (!decodedToken.user) {
        return response.status(401).json({ message: 'Invalid token' });
    }
    const users = await userModel.getAll(decodedToken.user.email);
    return response.status(200).json({ users });
};

const createUser = async (request: Request, response: Response): Promise<Response> => {
    const createdUser = await userModel.createUser(request.body);
    return response.status(201).json(createdUser);
};

const deleteUser = async (request: Request, response: Response): Promise<Response> => {
    const decodedToken = await getUserFromJWT(request);

    if (!decodedToken.user) {
        return response.status(401).json({ message: 'Invalid token' });
    }
    const hasUserAddres = await userModel.hasUserAddress(decodedToken.user.id);

    if(hasUserAddres){
        return response.status(409).json({ message: 'It is not possible to delete the user while there are addresses associated with them. Please delete all related addresses before proceeding with the user deletion.' });
    }
    await userModel.deleteUser(decodedToken.user.id);

    return response.status(204).json();
}

const updateUser = async (request: Request, response: Response): Promise<Response> => { 
    const decodedToken = await getUserFromJWT(request);

    if (!decodedToken.user) {
        return response.status(401).json({ message: 'Invalid token' });
    }

    await userModel.updateUser(Number(decodedToken.user.id), request.body);
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
        return { user: null, message: 'Token is required' };
    }

    try {
        return { user: jwt.verify(token, secretKey)} as {user: JWTUser};
    } catch (error) {
        return { user: null, message: (error as Error).message };
    }
}

export {
    getAll,
    createUser,
    deleteUser,
    updateUser,
    loginUser
};
