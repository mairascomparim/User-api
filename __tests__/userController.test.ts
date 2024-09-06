import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import * as userModel from '../src/models/userModel';
import {
  getAll,
  createUser,
  deleteUser,
  updateUser,
  loginUser
} from '../src/controllers/userController';

const app = express();
app.use(express.json());
app.get('/users', getAll);
app.post('/users', createUser);
app.delete('/users/:id', deleteUser);
app.put('/users/:id', updateUser);
app.post('/login', loginUser);

// Mock JWT and user model methods
jest.mock('jsonwebtoken');
jest.mock('../src/models/userModel');

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /users - Success', async () => {
    const mockToken = 'mockToken';
    const mockDecodedToken = { user: { email: 'test@example.com' } };
    const mockUsers = [{ id: 1, name: 'Test User' }];
    
    (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
    (userModel.getAll as jest.Mock).mockResolvedValue(mockUsers);
    const response = await request(app).get('/users').set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ users: mockUsers });
  });

  test('POST /users - Success', async () => {
    const newUser = { name: 'New User', email: 'new@example.com' };
    const mockCreatedUser = { id: 1, ...newUser };

    (userModel.createUser as jest.Mock).mockResolvedValue(mockCreatedUser);
    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockCreatedUser);
  });

  test('DELETE /users/:id - Success', async () => {
    const mockToken = 'mockToken';
    const mockDecodedToken = { user: { id: 1 } };

    (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
    (userModel.hasUserAddress as jest.Mock).mockResolvedValue(false);
    (userModel.deleteUser as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).delete('/users/1').set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(204);
  });

  test('PUT /users/:id - Success', async () => {
    const mockToken = 'mockToken';
    const mockDecodedToken = { user: { id: 1 } };
    const updatedUser = { name: 'Updated User' };

    (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
    (userModel.updateUser as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).put('/users/1').send(updatedUser).set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(204);
  });


  test('POST /login - Failure', async () => {
    const credentials = { email: 'user@example.com', password: 'wrongpassword' };
    const mockResult = { success: false, message: 'Invalid credentials' };

    (userModel.verifyPassword as jest.Mock).mockResolvedValue(mockResult);

    const response = await request(app).post('/login').send(credentials);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid credentials' });
  });
});
