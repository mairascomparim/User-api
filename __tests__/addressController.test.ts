import request from 'supertest';
import express from 'express';
import * as addressModel from '../src/models/addressModel';
import {
  getAll,
  createAddress,
  deleteAddress,
  updateAddress,
  getAddresses,
  getAddress
} from '../src/controllers/addressController';

const app = express();
app.use(express.json());
app.get('/addresses', getAll);
app.post('/addresses', createAddress);
app.delete('/addresses/:id', deleteAddress);
app.put('/addresses/:id', updateAddress);
app.get('/addresses', getAddresses);
app.get('/addresses/:id', getAddress);

jest.mock('../src/models/addressModel');

describe('Address Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /addresses - Success', async () => {
    const mockAddresses = [{ id: 1, city: 'Test City', country:'USA' }];
    (addressModel.getAll as jest.Mock).mockResolvedValue(mockAddresses);
  
    const response = await request(app).get('/addresses');
  
    expect(response.status).toBe(200);
    expect(response.body.address).toEqual(mockAddresses); 
  });
  

  test('POST /addresses - Success', async () => {
    const newAddress = { city: 'New City' };
    const mockResponse = { insertId: 1 };
    (addressModel.createAddress as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app).post('/addresses').send(newAddress);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockResponse);
  });

  test('DELETE /addresses/:id - Success', async () => {
    (addressModel.deleteAddress as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).delete('/addresses/1');

    expect(response.status).toBe(204);
  });

  test('PUT /addresses/:id - Success', async () => {
    (addressModel.updateAddress as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).put('/addresses/1').send({ city: 'Updated City' });

    expect(response.status).toBe(204);
  });

  test('GET /addresses?country=USA - Success', async () => {
    const mockAddresses = {"address":[{ id: 1, city: 'Test City', country: 'USA' }]};
    (addressModel.getAddressesByCountry as jest.Mock).mockResolvedValue(mockAddresses);

    const response = await request(app).get('/addresses?country=USA');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAddresses);
  });

  test('GET /addresses/:id - Success', async () => {
    const mockAddress = { id: 1, city: 'Test City' };
    (addressModel.getAddressById as jest.Mock).mockResolvedValue(mockAddress);

    const response = await request(app).get('/addresses/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAddress);
  });

  test('GET /addresses/:id - Not Found', async () => {
    (addressModel.getAddressById as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get('/addresses/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Address not found' });
  });
});
