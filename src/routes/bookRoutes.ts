import {Router} from 'express';
import { editBook, storeBook, updateBook } from '../controllers/booksController';
import { adminPermission } from '../middlewares/adminPermission';
import { validateJWT } from '../middlewares/validateJWT';
import { storeBookRequest } from '../middlewares/validations';

const router = Router();

router.get('/:id', [validateJWT,adminPermission],editBook);
router.post('/store', [validateJWT,adminPermission,storeBookRequest],storeBook);
router.put('/update/:id', [validateJWT,adminPermission,storeBookRequest],updateBook);

export default router;