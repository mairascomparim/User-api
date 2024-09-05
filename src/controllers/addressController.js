const addressModel = require('../models/addressModel');

const getAll = async (_request, response) => {
    const address = await addressModel.getAll();
    return response.status(200).json({address});
};

const createAddress = async (request, response) => {
    const createdAdress = await addressModel.createAdress(request.body);
    return response.status(201).json(createdAdress);
};

const deleteAdress = async (request, response) => {
    const {id} = request.params;

    await addressModel.deleteAddress(id);
    return response.status(204).json();
}

const updateAddress = async (request, response) => { 
    const {id} = request.params;
    
    await addressModel.updateAdress(id, request.body);
    return response.status(204).json();
}

module.exports = {
    getAll,
    createAddress,
    deleteAdress,
    updateAddress
}