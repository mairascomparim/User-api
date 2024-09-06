import { Request, Response } from 'express';
import * as addressModel from '../models/addressModel'; 
interface CreateAddressResponse {
    insertId: number;
}

// Controller to get all addresses
const getAll = async (_request: Request, response: Response): Promise<Response> => {
    try {
        const address = await addressModel.getAll();
        return response.status(200).json({ address });
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to create a new address
const createAddress = async (request: Request, response: Response): Promise<Response> => {
    try {
        const createdAddress: CreateAddressResponse = await addressModel.createAddress(request.body);
        return response.status(201).json(createdAddress);
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to delete an address
const deleteAddress = async (request: Request, response: Response): Promise<Response> => {
    try {
        const { id } = request.params;
        await addressModel.deleteAddress(Number(id));
        return response.status(204).json();
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to update an address
const updateAddress = async (request: Request, response: Response): Promise<Response> => {
    try {
        const { id } = request.params;
        await addressModel.updateAddress(Number(id), request.body);
        return response.status(204).json();
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to get addresses by country
const getAddresses = async (req: Request, res: Response) => {
    const { country } = req.query;
  
    try {
      if (country) {
        const addresses = await addressModel.getAddressesByCountry(country as string);
        res.json(addresses);
      } else {
        const addresses = await addressModel.getAllAddresses();
        res.json(addresses);
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Controller to get address by ID
const getAddress = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const address = await addressModel.getAddressById(id);
      if (address) {
        res.json(address);
      } else {
        res.status(404).json({ message: 'Address not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export {
    getAll,
    createAddress,
    deleteAddress,
    updateAddress,
    getAddress,
    getAddresses
};
