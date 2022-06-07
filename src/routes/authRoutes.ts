import {Router} from 'express';
import { createSecretAdmin, login, refreshToken, signUp, userData } from '../controllers/authController';
import { validateJWT } from '../middlewares/validateJWT';
import { loginRequest, registerRequest } from '../middlewares/validations';

const router = Router();

router.post('/create-admin-secretly', registerRequest, createSecretAdmin);
router.post('/sign-up', registerRequest, signUp);
router.post('/login', loginRequest,login);
router.post('/refresh-token', validateJWT, refreshToken);
router.get('/userData', validateJWT, userData);

export default router;