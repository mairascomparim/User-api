import express from 'express';
import { getAll as getUserDataGroupedByEmail, createUser, deleteUser, updateUser, loginUser } from './controllers/userController';
import { getAll as getAllAddresses, createAddress, deleteAddress, updateAddress } from './controllers/addressController';
import { validateBody as validateUserBody } from './middlewares/userMiddleware';
import { validateBody as validateAddressBody } from './middlewares/addressMiddleware';
import authenticateToken from './middlewares/authMiddleware';

const router = express.Router();

router.get('/users', authenticateToken, getUserDataGroupedByEmail);
router.post('/user', validateUserBody, createUser);
router.delete('/user/:id', authenticateToken, deleteUser);
router.put('/user/:id', authenticateToken, validateUserBody, updateUser);
router.post('/login', loginUser);

router.get('/address', authenticateToken, getAllAddresses);
router.post('/address', authenticateToken, validateAddressBody, createAddress);
router.delete('/address/:id', authenticateToken, deleteAddress);
router.put('/address/:id', authenticateToken, updateAddress);

export default router;
