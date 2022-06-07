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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPermission = void 0;
const models_1 = require("../models");
const adminPermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    try {
        const user = yield models_1.User.findById(uid);
        if (user.role !== 'Admin') {
            return res.status(401).json({
                msg: 'This action is only authorized for admins'
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'This action is only authorized for admins',
            resetUser: true
        });
    }
});
exports.adminPermission = adminPermission;
//# sourceMappingURL=adminPermission.js.map