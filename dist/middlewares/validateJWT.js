"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const validateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('token');
    const jwtKey = process.env.JWT_KEY;
    try {
        if (!token) {
            return res.status(401).json({
                msg: 'No token on header'
            });
        }
        const { uid } = jsonwebtoken_1.default.verify(token, jwtKey);
        const user = yield models_1.User.findById(uid);
        if (!user) {
            return res.status(401).json({
                msg: 'Not valid token or the user does not exist',
            });
        }
        // Verify if user is active
        if (!user.isActive || !user.hasAccess) {
            return res.status(401).json({
                msg: 'Not valid token - user without access to the platform',
            });
        }
        req.body.uid = uid;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Not valid token',
            resetUser: true
        });
    }
});
exports.validateJWT = validateJWT;
//# sourceMappingURL=validateJWT.js.map