const express = require('express');
const { getAll: getAllUsers, createUser, deleteUser, updateUser } = require('./controllers/userController');
const { getAll: getAllAddresses, createAddress, deleteAdress, updateAddress } = require('./controllers/addressController');
const { validateBody: validateUserBody } = require('./middlewares/userMiddleware');
const { validateBody: validateAddressBody } = require('./middlewares/addressMiddleware');

const router = express.Router();

router.get('/users',getAllUsers)
router.post('/user',validateUserBody, createUser)
router.delete('/user/:id', deleteUser);
router.put('/user/:id', validateUserBody, updateUser);

router.get('/address',getAllAddresses)
router.post('/address',validateAddressBody, createAddress);
router.delete('/address/:id',deleteAdress);
router.put('/address/:id', updateAddress);

module.exports = router;
