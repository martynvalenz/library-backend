import {Router} from 'express';
import { getAccount, storeUser, updateUser } from '../controllers/usersController';
import { adminPermission } from '../middlewares/adminPermission';
import { validateJWT } from '../middlewares/validateJWT';
import { registerRequest, updateUserRequest } from '../middlewares/validations';

const router = Router();

// router.get('/', []);
router.post('/store', [validateJWT,adminPermission,registerRequest],storeUser);
router.get('/me', [validateJWT],getAccount);
router.put('/update/:id', [validateJWT,adminPermission,updateUserRequest],updateUser);

export default router;