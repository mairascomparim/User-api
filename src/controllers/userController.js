const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');


const getAll = async (request, response) => {
    const authHeader = request.headers['authorization'];    
    const token = authHeader && authHeader.split(' ')[1];
    const dadosToken = decodeToken(token,'liven');
    const email = dadosToken['email'];
    const users = await userModel.getAll(email);
    return response.status(200).json({users});
};

const createUser = async (request, response) => {
    const createdUser = await userModel.createUser(request.body);

    return response.status(201).json(createdUser);
};

const deleteUser = async (request, response) => {
    const {id} = request.params;

    await userModel.deleteUser(id);
    return response.status(204).json();
}

const updateUser = async (request, response) => { 
    const {id} = request.params;

    await userModel.updateUser(id, request.body);
    return response.status(204).json();
}

const loginUser = async (request, response) => {
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

function decodeToken(token, secretKey) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded; // Retorna o payload do token
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    getAll,
    createUser,
    deleteUser,
    updateUser,
    loginUser
}