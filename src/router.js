const express = require('express');
const { getAll: getAllUsers, createUser, deleteUser } = require('./controllers/userController');
const { getAll: getAllAddresses, createAddress, deleteAdress } = require('./controllers/addressController');
const { validateBody: validateUserBody } = require('./middlewares/userMiddleware');
const { validateBody: validateAddressBody } = require('./middlewares/addressMiddleware');

const router = express.Router();

router.get('/users',getAllUsers)
router.post('/user',validateUserBody, createUser)
router.delete('/user/:id', deleteUser);

router.get('/address',getAllAddresses)
router.post('/address',validateAddressBody, createAddress);
router.delete('/address/:id',deleteAdress);

module.exports = router;
