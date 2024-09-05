import { Request, Response } from 'express';
import * as addressModel from '../models/addressModel'; // Ajuste a importação para TypeScript

// Objeto de resposta para a criação de endereço
interface CreateAddressResponse {
    insertId: number;
}

// Controlador para obter todos os endereços
const getAll = async (_request: Request, response: Response): Promise<Response> => {
    try {
        const address = await addressModel.getAll();
        return response.status(200).json({ address });
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};

// Controlador para criar um novo endereço
const createAddress = async (request: Request, response: Response): Promise<Response> => {
    try {
        const createdAddress: CreateAddressResponse = await addressModel.createAddress(request.body);
        return response.status(201).json(createdAddress);
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};

// Controlador para deletar um endereço
const deleteAddress = async (request: Request, response: Response): Promise<Response> => {
    try {
        const { id } = request.params;
        await addressModel.deleteAddress(Number(id));
        return response.status(204).json();
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};

// Controlador para atualizar um endereço
const updateAddress = async (request: Request, response: Response): Promise<Response> => {
    try {
        const { id } = request.params;
        await addressModel.updateAddress(Number(id), request.body);
        return response.status(204).json();
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};

export {
    getAll,
    createAddress,
    deleteAddress,
    updateAddress
};
