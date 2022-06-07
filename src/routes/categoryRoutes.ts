import {Router} from 'express';
import { createCategory } from '../controllers/categoriesController';
import { adminPermission } from '../middlewares/adminPermission';
import { validateJWT } from '../middlewares/validateJWT';
import { categoryRequest } from '../middlewares/validations';

const router = Router();

// router.get('/accounts', []);
router.post('/create',[validateJWT,adminPermission,categoryRequest],createCategory);

export default router;