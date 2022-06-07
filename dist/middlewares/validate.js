"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validatorjs_1 = __importDefault(require("validatorjs"));
const validator = (body, rules, customMessages, callback) => {
    const validation = new validatorjs_1.default(body, rules, customMessages);
    validation.setAttributeNames({
        lastName: 'last name',
        coverImage: 'cover image',
        categoryId: 'category',
    });
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};
exports.default = validator;
//# sourceMappingURL=validate.js.map