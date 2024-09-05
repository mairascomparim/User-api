const express = require('express');
const { getAll: getUserDataGroupedByEmail, createUser, deleteUser, updateUser, loginUser } = require('./controllers/userController');
const { getAll: getAllAddresses, createAddress, deleteAdress, updateAddress } = require('./controllers/addressController');
const { validateBody: validateUserBody } = require('./middlewares/userMiddleware');
const { validateBody: validateAddressBody } = require('./middlewares/addressMiddleware');
const authenticateToken = require('./middlewares/authMiddleware');


const router = express.Router();

router.get('/users',authenticateToken, getUserDataGroupedByEmail)
router.post('/user',validateUserBody, createUser)
router.delete('/user/:id',authenticateToken, deleteUser);
router.put('/user/:id', authenticateToken, validateUserBody, updateUser);
router.post('/login', loginUser);

router.get('/address',authenticateToken, getAllAddresses)
router.post('/address',authenticateToken, validateAddressBody, createAddress);
router.delete('/address/:id',authenticateToken, deleteAdress);
router.put('/address/:id',authenticateToken, updateAddress);

module.exports = router;
