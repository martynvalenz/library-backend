import {Router} from 'express';
import { editBook, getBooks, storeBook, updateBook } from '../controllers/booksController';
import { adminPermission } from '../middlewares/adminPermission';
import { validateJWT } from '../middlewares/validateJWT';
import { storeBookRequest } from '../middlewares/validations';

const router = Router();

router.post('/', /* [validateJWT], */ getBooks);
router.get('/:id', [validateJWT,adminPermission],editBook);
router.post('/store', [validateJWT,adminPermission,storeBookRequest],storeBook);
router.put('/update/:id', [validateJWT,adminPermission,storeBookRequest],updateBook);
 
export default router;