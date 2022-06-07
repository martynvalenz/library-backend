"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booksController_1 = require("../controllers/booksController");
const adminPermission_1 = require("../middlewares/adminPermission");
const validateJWT_1 = require("../middlewares/validateJWT");
const validations_1 = require("../middlewares/validations");
const router = (0, express_1.Router)();
router.post('/store', [validateJWT_1.validateJWT, adminPermission_1.adminPermission, validations_1.storeBookRequest], booksController_1.storeBook);
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map