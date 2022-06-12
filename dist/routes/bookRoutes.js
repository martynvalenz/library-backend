"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booksController_1 = require("../controllers/booksController");
const adminPermission_1 = require("../middlewares/adminPermission");
const validateJWT_1 = require("../middlewares/validateJWT");
const validations_1 = require("../middlewares/validations");
const router = (0, express_1.Router)();
router.post('/', [validateJWT_1.validateJWT], booksController_1.getBooks);
router.post('/admins', [validateJWT_1.validateJWT, adminPermission_1.adminPermission], booksController_1.getBooksAdmin);
router.get('/:id', [validateJWT_1.validateJWT, adminPermission_1.adminPermission], booksController_1.editBook);
router.post('/store', [validateJWT_1.validateJWT, adminPermission_1.adminPermission, validations_1.storeBookRequest], booksController_1.storeBook);
router.put('/update/:id', [validateJWT_1.validateJWT, adminPermission_1.adminPermission, validations_1.storeBookRequest], booksController_1.updateBook);
// Favorites
router.post('/favorites', [validateJWT_1.validateJWT], booksController_1.getFavorites);
router.post('/add-favorite', [validateJWT_1.validateJWT], booksController_1.addFavorite);
router.post('/remove-favorite', [validateJWT_1.validateJWT], booksController_1.removeFavorite);
// Cart
router.put('/view-cart/:userId', [validateJWT_1.validateJWT], booksController_1.viewCart);
router.post('/add-to-cart', [validateJWT_1.validateJWT], booksController_1.addCart);
router.post('/add-to-cart-from-favorites', [validateJWT_1.validateJWT], booksController_1.addCartFromFavorites);
router.post('/clear-cart', [validateJWT_1.validateJWT], booksController_1.clearCart);
router.put('/remove-from-cart/:bookId', [validateJWT_1.validateJWT], booksController_1.removeBookFromCart);
// Loans
router.post('/request-loan', [validateJWT_1.validateJWT], booksController_1.requestLoan);
router.put('/accept-request/:notificationId', [validateJWT_1.validateJWT, adminPermission_1.adminPermission], booksController_1.acceptRequest);
router.post('/loans/:userId', [validateJWT_1.validateJWT], booksController_1.getLoans);
router.post('/confirm-loan', [validateJWT_1.validateJWT, adminPermission_1.adminPermission], booksController_1.confirmLoan);
router.put('/loans/turn-in/:bookId', [validateJWT_1.validateJWT, adminPermission_1.adminPermission], booksController_1.turInBook);
router.put('/loans/turn-in-all-books', [validateJWT_1.validateJWT, adminPermission_1.adminPermission], booksController_1.turInAllBooks);
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map