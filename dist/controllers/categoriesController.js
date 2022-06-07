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
exports.createCategory = void 0;
const slugify_1 = require("../helpers/slugify");
const models_1 = require("../models");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const checkCategory = yield models_1.Category.findOne({ category: data.category });
        if (checkCategory) {
            return res.status(400).json({
                success: false,
                msg: 'Category already exists',
            });
        }
        data.slug = yield (0, slugify_1.makeSlug)(data.category);
        const category = yield models_1.Category.create(data);
        res.send({
            category
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server Error, contact support'
        });
    }
});
exports.createCategory = createCategory;
//# sourceMappingURL=categoriesController.js.map