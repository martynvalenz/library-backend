"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booksController_1 = require("../controllers/booksController");
const adminPermission_1 = require("../middlewares/adminPermission");
const validateJWT_1 = require("../middlewares/validateJWT");
const validations_1 = require("../middlewares/validations");
const router = (0, express_1.Router)();
router.post('/', /* [validateJWT], */ booksController_1.getBooks);
router.get('/:id', [validateJWT_1.validateJWT, adminPermission_1.adminPermission], booksController_1.editBook);
router.post('/store', [validateJWT_1.validateJWT, adminPermission_1.adminPermission, validations_1.storeBookRequest], booksController_1.storeBook);
router.put('/update/:id', [validateJWT_1.validateJWT, adminPermission_1.adminPermission, validations_1.storeBookRequest], booksController_1.updateBook);
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map