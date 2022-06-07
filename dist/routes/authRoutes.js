"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validateJWT_1 = require("../middlewares/validateJWT");
const validations_1 = require("../middlewares/validations");
const router = (0, express_1.Router)();
router.post('/create-admin-secretly', validations_1.registerRequest, authController_1.createSecretAdmin);
router.post('/sign-up', validations_1.registerRequest, authController_1.signUp);
router.post('/login', validations_1.loginRequest, authController_1.login);
router.post('/refresh-token', validateJWT_1.validateJWT, authController_1.refreshToken);
router.get('/userData', validateJWT_1.validateJWT, authController_1.userData);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map