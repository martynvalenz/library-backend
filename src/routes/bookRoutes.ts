import {Router} from 'express';
import { addCart, addCartFromFavorites, addFavorite, clearCart, confirmLoan, editBook, getBooks, getBooksAdmin, getFavorites, getLoans, removeBookFromCart, removeFavorite, storeBook, turInAllBooks, turInBook, updateBook, viewCart, requestLoan, acceptRequest } from '../controllers/booksController';
import { adminPermission } from '../middlewares/adminPermission';
import { validateJWT } from '../middlewares/validateJWT';
import { storeBookRequest } from '../middlewares/validations';

const router = Router();

router.post('/', [validateJWT], getBooks);
router.post('/admins', [validateJWT,adminPermission], getBooksAdmin);
router.get('/:id', [validateJWT,adminPermission],editBook);
router.post('/store', [validateJWT,adminPermission,storeBookRequest],storeBook);
router.put('/update/:id', [validateJWT,adminPermission,storeBookRequest],updateBook);
// Favorites
router.post('/favorites',[validateJWT],getFavorites);
router.post('/add-favorite',[validateJWT],addFavorite);
router.post('/remove-favorite',[validateJWT],removeFavorite);
// Cart
router.put('/view-cart/:userId',[validateJWT],viewCart);
router.post('/add-to-cart',[validateJWT],addCart);
router.post('/add-to-cart-from-favorites',[validateJWT],addCartFromFavorites);
router.post('/clear-cart',[validateJWT],clearCart);
router.put('/remove-from-cart/:bookId',[validateJWT],removeBookFromCart);
// Loans
router.post('/request-loan',[validateJWT],requestLoan);
router.put('/accept-request/:notificationId',[validateJWT,adminPermission],acceptRequest);
router.post('/loans/:userId',[validateJWT],getLoans);
router.post('/confirm-loan',[validateJWT,adminPermission],confirmLoan);
router.put('/loans/turn-in/:bookId',[validateJWT,adminPermission],turInBook);
router.put('/loans/turn-in-all-books',[validateJWT,adminPermission],turInAllBooks);
 
export default router;