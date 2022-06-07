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
exports.getMovement = exports.initialAccount = exports.subtractToAccount = exports.sumToAccount = void 0;
const models_1 = require("../models");
const sumToAccount = (id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield models_1.Account.findById(id)
            .select('initialAmount income expenses balance');
        const income = Number(account.income) + Number(amount);
        const balance = Number(account.balance) + Number(amount);
        yield models_1.Account.findByIdAndUpdate(id, {
            income: income.toFixed(2),
            balance: balance.toFixed(2),
        });
        return;
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.sumToAccount = sumToAccount;
const subtractToAccount = (id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield models_1.Account.findById(id)
            .select('initialAmount income expenses balance');
        const expenses = Number(account.expenses) + Number(amount);
        const balance = Number(account.balance) - Number(amount);
        yield models_1.Account.findByIdAndUpdate(id, {
            expenses: expenses.toFixed(2),
            balance: balance.toFixed(2),
        });
        yield models_1.Account.findByIdAndUpdate(id, {
            expense: account.expense + amount,
            balance: account.balance - amount,
        });
        return;
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.subtractToAccount = subtractToAccount;
const initialAccount = (id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield models_1.Account.findById(id)
            .select('initialAmount income expenses balance');
        const balance = amount + account.income - account.expenses;
        yield models_1.Account.findByIdAndUpdate(id, {
            initialAmount: amount,
            balance,
        });
        return;
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.initialAccount = initialAccount;
const getMovement = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movement = yield models_1.Movement.findById(id)
            .select('amount date tax folio isBilled movementType status')
            .populate([
            {
                path: "accountId",
                select: "id account cardNumber color",
            },
            {
                path: "expenseCatalogId",
                select: "id catalog",
            },
            {
                path: "expenseCategoryId",
                select: "id category",
            },
            {
                path: "incomeCatalogId",
                select: "id catalog",
            },
            {
                path: "incomeConceptId",
                select: "id concept",
            },
        ]);
        return movement;
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.getMovement = getMovement;
//# sourceMappingURL=accountMovements.js.map