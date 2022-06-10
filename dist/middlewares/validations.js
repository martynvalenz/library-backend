"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeBookRequest = exports.categoryRequest = exports.updateUserRequest = exports.loginRequest = exports.registerRequest = void 0;
const validate_1 = __importDefault(require("./validate"));
const registerRequest = (req, res, next) => {
    const validationRule = {
        "name": "required",
        "lastName": "required",
        "email": "required",
        "password": "required|min:6",
    };
    (0, validate_1.default)(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(400)
                .send({
                success: false,
                msg: 'Cannot save the user, check the fields',
                errors: err.errors
            });
            return;
        }
        next();
    });
};
exports.registerRequest = registerRequest;
const loginRequest = (req, res, next) => {
    const validationRule = {
        "email": "required",
        "password": "required|min:6",
    };
    (0, validate_1.default)(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(400)
                .send({
                success: false,
                msg: 'Credentials do not match our records',
                errors: err.errors
            });
            return;
        }
        next();
    });
};
exports.loginRequest = loginRequest;
const updateUserRequest = (req, res, next) => {
    const validationRule = {
        "name": "required",
        "lastName": "required",
        "email": "required"
    };
    (0, validate_1.default)(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(400)
                .send({
                success: false,
                msg: 'Cannot save the user, check the fields',
                errors: err.errors
            });
            return;
        }
        next();
    });
};
exports.updateUserRequest = updateUserRequest;
const categoryRequest = (req, res, next) => {
    const validationRule = {
        "category": "required",
    };
    (0, validate_1.default)(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(400)
                .send({
                success: false,
                msg: 'Error on form validation',
                errors: err.errors
            });
            return;
        }
        next();
    });
};
exports.categoryRequest = categoryRequest;
const storeBookRequest = (req, res, next) => {
    const validationRule = {
        "title": "required",
        "author": "required",
        "coverImage": "required",
        "year": "required",
        "stock": "required|numeric|min:0",
        "categoryId": "required",
    };
    (0, validate_1.default)(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(400)
                .send({
                success: false,
                msg: 'Error on form validation',
                errors: err.errors
            });
            return;
        }
        next();
    });
};
exports.storeBookRequest = storeBookRequest;
//# sourceMappingURL=validations.js.map