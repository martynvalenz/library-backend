import {Router} from 'express';
import { storeBook } from '../controllers/booksController';
import { adminPermission } from '../middlewares/adminPermission';
import { validateJWT } from '../middlewares/validateJWT';
import { storeBookRequest } from '../middlewares/validations';

const router = Router();

router.post('/store', [validateJWT,adminPermission,storeBookRequest],storeBook);

export default router;