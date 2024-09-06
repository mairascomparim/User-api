import { Request, Response } from 'express';
import * as userModel from '../src/models/userModel';
import jwt from 'jsonwebtoken';
import { getAll, createUser, deleteUser, updateUser, loginUser } from '../src/controllers/userController';

jest.mock('../src/models/userModel');
jest.mock('jsonwebtoken');

const mockRequest = () => {
    return {
        headers: {},
        body: {},
        params: {},
    } as Request;
};

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('User Controller Tests', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for getAll
    describe('getAll', () => {
        it('should return 401 if token is invalid', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.headers['authorization'] = '';

            await getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        });

        it('should return all users if token is valid', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.headers['authorization'] = 'Bearer validToken';

            const mockDecodedToken = { user: { email: 'test@example.com' } };
            (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);

            const mockUsers = [{ id: 1, email: 'test@example.com' }];
            (userModel.getAll as jest.Mock).mockResolvedValue(mockUsers);

            await getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
        });
    });

    // Test for createUser
    describe('createUser', () => {
        it('should create a user and return 201 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.body = { name: 'John Doe', email: 'john@example.com', password: 'password' };

            const mockCreatedUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
            (userModel.createUser as jest.Mock).mockResolvedValue(mockCreatedUser);

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCreatedUser);
        });
    });

    // Test for deleteUser
    describe('deleteUser', () => {
        it('should return 409 if user has associated addresses', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.headers['authorization'] = 'Bearer validToken';

            const mockDecodedToken = { user: { id: 1 } };
            (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
            (userModel.hasUserAddress as jest.Mock).mockResolvedValue(true);

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: 'It is not possible to delete the user while there are addresses associated with them. Please delete all related addresses before proceeding with the user deletion.'
            });
        });

        it('should delete user and return 204 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.headers['authorization'] = 'Bearer validToken';

            const mockDecodedToken = { user: { id: 1 } };
            (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
            (userModel.hasUserAddress as jest.Mock).mockResolvedValue(false);
            (userModel.deleteUser as jest.Mock).mockResolvedValue(null);

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
        });
    });

    // Test for updateUser
    describe('updateUser', () => {
        it('should update a user and return 204 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.headers['authorization'] = 'Bearer validToken';
            req.body = { name: 'John Updated' };

            const mockDecodedToken = { user: { id: 1 } };
            (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
            (userModel.updateUser as jest.Mock).mockResolvedValue(null);

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
        });
    });

    // Test for loginUser
    describe('loginUser', () => {
        it('should return 400 if login fails', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.body = { email: 'wrong@example.com', password: 'wrongpassword' };

            (userModel.verifyPassword as jest.Mock).mockResolvedValue({
                success: false,
                message: 'Invalid credentials',
            });

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        it('should return 200 with token if login is successful', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.body = { email: 'test@example.com', password: 'password' };

            const mockUser = { USERID: 1, EMAIL: 'test@example.com', NAME: 'Test User' };
            (userModel.verifyPassword as jest.Mock).mockResolvedValue({
                success: true,
                user: mockUser,
            });

            const mockToken = 'mockJwtToken';
            (jwt.sign as jest.Mock).mockReturnValue(mockToken);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Successful login',
                token: mockToken,
                user: {
                    id: mockUser.USERID,
                    name: mockUser.NAME,
                    email: mockUser.EMAIL,
                },
            });
        });
    });
});
