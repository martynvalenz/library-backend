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
exports.userData = exports.refreshToken = exports.login = exports.signUp = exports.createSecretAdmin = void 0;
const getRandomColors_1 = __importDefault(require("../helpers/getRandomColors"));
const models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateJWT_1 = require("../helpers/generateJWT");
const luxon_1 = require("luxon");
const createSecretAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = __rest(req.body, []);
    try {
        const findUser = yield models_1.User.findOne({ email: data.email });
        if (findUser) {
            return res.status(400).json({
                msg: 'The email already exists!'
            });
        }
        // If no errors resume user creation
        const initials = `${data.name.charAt(0)}${data.lastName.charAt(0)}`;
        data.color = yield (0, getRandomColors_1.default)();
        const lastLogin = new Date();
        Object.assign(data, { initials, lastLogin, role: 'Admin' });
        const salt = bcrypt_1.default.genSaltSync();
        data.password = bcrypt_1.default.hashSync(data.password, salt);
        const newUser = yield models_1.User.create(data);
        res.send({
            newUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server Error, contact support'
        });
    }
});
exports.createSecretAdmin = createSecretAdmin;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = __rest(req.body, []);
    try {
        const findUser = yield models_1.User.findOne({ email: data.email });
        if (findUser) {
            return res.status(400).json({
                msg: 'The email already exists!'
            });
        }
        // If no errors resume user creation
        const initials = `${data.name.charAt(0)}${data.lastName.charAt(0)}`;
        data.color = yield (0, getRandomColors_1.default)();
        const lastLogin = new Date();
        let role = 'User';
        if (data.createAdmin) {
            role = 'Admin';
        }
        Object.assign(data, { initials, lastLogin, role });
        const salt = bcrypt_1.default.genSaltSync();
        data.password = bcrypt_1.default.hashSync(data.password, salt);
        const user = yield models_1.User.create(data);
        // Generate JWT
        const token = yield (0, generateJWT_1.generateJWT)(user.id);
        res.send({
            token,
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server Error, contact support'
        });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const timezone = req.header('timezone');
    try {
        const user = yield models_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                'msg': 'The credentials are not in our database.'
            });
        }
        if (!user.isActive || !user.hasAccess) {
            return res.status(404).json({
                msg: 'The user has no access to the platform'
            });
        }
        const validPassword = yield bcrypt_1.default.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'The credentials are not in our database.'
            });
        }
        const now = luxon_1.DateTime.now();
        const lastLogin = luxon_1.DateTime.fromISO(now, { zone: timezone });
        yield models_1.User.findByIdAndUpdate(user.id, { lastLogin });
        // Generate JWT
        const token = yield (0, generateJWT_1.generateJWT)(user.id);
        res.send({
            token,
            name: user.name,
            lastName: user.lastName
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server Error, contact support'
        });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // User uid
    const { uid } = req.body;
    const timezone = req.header('timezone');
    try {
        // Generar nuevo JWT
        const token = yield (0, generateJWT_1.generateJWT)(uid);
        const now = luxon_1.DateTime.now();
        const date = luxon_1.DateTime.fromISO(now, { zone: timezone }).toFormat('yyyy-MM-dd');
        const time = luxon_1.DateTime.fromISO(now, { zone: timezone }).toFormat('HH:mm:ss');
        yield models_1.User.findByIdAndUpdate(uid, { lastLogin: `${date} ${time}` });
        res.send({
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server Error, contact support'
        });
    }
});
exports.refreshToken = refreshToken;
const userData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.body;
        const timezone = req.header('timezone');
        const now = luxon_1.DateTime.now();
        const date = luxon_1.DateTime.fromISO(now, { zone: timezone }).toFormat('yyyy-MM-dd');
        const time = luxon_1.DateTime.fromISO(now, { zone: timezone }).toFormat('HH:mm:ss');
        yield models_1.User.findByIdAndUpdate(uid, { lastLogin: `${date} ${time}` });
        const user = yield models_1.User.findById(uid).select('initials name lastName email color role');
        const categories = yield models_1.Category.find().sort({ category: 1 });
        const books = yield models_1.Book.find()
            .sort({ title: 1 })
            .populate([
            { path: 'userId', select: 'id name lastName' },
            { path: 'categoryId', select: 'id category slug' },
        ]);
        let users = [];
        if (user.role === 'Admin') {
            users = yield models_1.User.find().select('id initials name lastName email color loans hasAccess role').sort({ name: 1 });
        }
        res.send({
            user,
            categories,
            books,
            users,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server Error, contact support'
        });
    }
});
exports.userData = userData;
//# sourceMappingURL=authController.js.map