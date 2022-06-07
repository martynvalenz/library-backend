"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriesController_1 = require("../controllers/categoriesController");
const adminPermission_1 = require("../middlewares/adminPermission");
const validateJWT_1 = require("../middlewares/validateJWT");
const validations_1 = require("../middlewares/validations");
const router = (0, express_1.Router)();
// router.get('/accounts', []);
router.post('/create', [validateJWT_1.validateJWT, adminPermission_1.adminPermission, validations_1.categoryRequest], categoriesController_1.createCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map