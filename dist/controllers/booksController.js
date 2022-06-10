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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBook = exports.editBook = exports.storeBook = void 0;
const slugify_1 = require("../helpers/slugify");
const models_1 = require("../models");
const storeBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { uid } = _a, data = __rest(_a, ["uid"]);
        const checkTitle = yield models_1.Book.findOne({ title: data.title });
        if (checkTitle) {
            return res.status(400).json({
                success: false,
                msg: 'Book title already exists',
            });
        }
        data.slug = yield (0, slugify_1.makeSlug)(data.title);
        data.userId = uid;
        const newBook = yield models_1.Book.create(data);
        yield models_1.Category.findByIdAndUpdate(data.categoryId, {
            $inc: { books: 1 }
        });
        const book = yield models_1.Book.findById(newBook._id)
            .populate([
            { path: 'userId', select: 'id name lastName' },
            { path: 'categoryId', select: 'id category slug' },
        ]);
        res.send({
            book
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server Error, contact support'
        });
    }
});
exports.storeBook = storeBook;
const editBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const book = yield models_1.Book.findById(id);
        res.send({
            book
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server Error, contact support'
        });
    }
});
exports.editBook = editBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const _b = req.body, { uid } = _b, data = __rest(_b, ["uid"]);
        const checkTitle = yield models_1.Book.findOne({
            $and: [
                { title: data.title, _id: { $ne: id } },
            ]
        });
        if (checkTitle) {
            return res.status(400).json({
                success: false,
                msg: 'Book title already exists',
            });
        }
        const checkCategory = yield models_1.Book.findById(id).select('categoryId');
        if (checkCategory.categoryId !== data.categoryId) {
            yield models_1.Category.findByIdAndUpdate(checkCategory.categoryId, {
                $inc: { books: -1 }
            });
            yield models_1.Category.findByIdAndUpdate(data.categoryId, {
                $inc: { books: 1 }
            });
        }
        data.slug = yield (0, slugify_1.makeSlug)(data.title);
        data.userId = uid;
        const updateBook = yield models_1.Book.findByIdAndUpdate(id, data);
        const book = yield models_1.Book.findById(updateBook._id)
            .populate([
            { path: 'userId', select: 'id name lastName' },
            { path: 'categoryId', select: 'id category slug' },
        ]);
        res.send({
            book
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server Error, contact support'
        });
    }
});
exports.updateBook = updateBook;
//# sourceMappingURL=booksController.js.map