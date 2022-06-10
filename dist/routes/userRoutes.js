"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
const adminPermission_1 = require("../middlewares/adminPermission");
const validateJWT_1 = require("../middlewares/validateJWT");
const validations_1 = require("../middlewares/validations");
const router = (0, express_1.Router)();
// router.get('/', []);
router.post('/store', [validateJWT_1.validateJWT, adminPermission_1.adminPermission, validations_1.registerRequest], usersController_1.storeUser);
router.get('/me', [validateJWT_1.validateJWT], usersController_1.getAccount);
router.put('/update/:id', [validateJWT_1.validateJWT, adminPermission_1.adminPermission, validations_1.updateUserRequest], usersController_1.updateUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map