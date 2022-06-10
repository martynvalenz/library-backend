import {Router} from 'express';
import { storeUser, updateUser } from '../controllers/usersController';
import { adminPermission } from '../middlewares/adminPermission';
import { validateJWT } from '../middlewares/validateJWT';
import { registerRequest, updateUserRequest } from '../middlewares/validations';

const router = Router();

// router.get('/', []);
router.post('/store', [validateJWT,adminPermission,registerRequest],storeUser);
router.put('/update/:id', [validateJWT,adminPermission,updateUserRequest],updateUser);

export default router;