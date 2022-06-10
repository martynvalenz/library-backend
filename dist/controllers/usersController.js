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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getAccount = exports.storeUser = void 0;
const models_1 = require("../models");
const authController_1 = require("./authController");
const bcrypt_1 = __importDefault(require("bcrypt"));
const storeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, authController_1.signUp)(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.storeUser = storeUser;
const getAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.body;
        const user = yield models_1.User.findById(uid);
        res.send({
            user
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.getAccount = getAccount;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = __rest(req.body, []);
        const findUser = yield models_1.User.findOne({
            $and: [
                { email: data.email, _id: { $ne: id } },
            ]
        });
        if (findUser) {
            return res.status(400).json({
                findUser,
                msg: 'The email is already being used by an existing user'
            });
        }
        const initials = `${data.name.charAt(0)}${data.lastName.charAt(0)}`;
        data.initials = initials;
        if (data.password) {
            const salt = bcrypt_1.default.genSaltSync();
            data.password = bcrypt_1.default.hashSync(data.password, salt);
            yield models_1.User.findByIdAndUpdate(id, {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                initials: data.initials,
                hasAccess: data.hasAccess,
                password: data.password,
                role: data.role,
            });
        }
        else {
            yield models_1.User.findByIdAndUpdate(id, {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                initials: data.initials,
                hasAccess: data.hasAccess,
                role: data.role,
            });
        }
        const user = yield models_1.User.findById(id);
        res.send({
            user
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=usersController.js.map