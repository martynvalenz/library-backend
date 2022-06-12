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
exports.turInAllBooks = exports.turInBook = exports.confirmLoan = exports.acceptRequest = exports.requestLoan = exports.getLoans = exports.removeBookFromCart = exports.addCartFromFavorites = exports.addCart = exports.clearCart = exports.viewCart = exports.removeFavorite = exports.addFavorite = exports.getFavorites = exports.updateBook = exports.editBook = exports.storeBook = exports.getBooksAdmin = exports.getBooks = void 0;
const slugify_1 = require("../helpers/slugify");
const models_1 = require("../models");
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, limit, page } = req.body;
        let results = [];
        if (category) {
            results = yield models_1.Book.paginate({ isActive: true, categoryId: category }, { limit: parseInt(limit), page: parseInt(page) });
        }
        else {
            results = yield models_1.Book.paginate({ isActive: true }, { limit: parseInt(limit), page: parseInt(page) });
        }
        res.send({
            results
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.getBooks = getBooks;
const getBooksAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, page } = req.body;
        const results = yield models_1.Book.paginate({}, { limit: parseInt(limit), page: parseInt(page) });
        res.send({
            results
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.getBooksAdmin = getBooksAdmin;
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
        if ((checkCategory === null || checkCategory === void 0 ? void 0 : checkCategory.categoryId) !== data.categoryId) {
            yield models_1.Category.findByIdAndUpdate(checkCategory === null || checkCategory === void 0 ? void 0 : checkCategory.categoryId, {
                $inc: { books: -1 }
            });
            yield models_1.Category.findByIdAndUpdate(data.categoryId, {
                $inc: { books: 1 }
            });
        }
        data.slug = yield (0, slugify_1.makeSlug)(data.title);
        data.userId = uid;
        const updateBook = yield models_1.Book.findByIdAndUpdate(id, data);
        const book = yield models_1.Book.findById(updateBook === null || updateBook === void 0 ? void 0 : updateBook._id)
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
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.body;
        const favorites = yield models_1.Favorite.find({ userId: uid })
            .populate([
            { path: 'bookId', select: 'id title slug coverImage author year  categoryId userId isActive stock' },
        ]);
        res.send({
            favorites
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.getFavorites = getFavorites;
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, bookId } = req.body;
        const checkFavorite = yield models_1.Favorite.findOne({ bookId, userId: uid });
        if (checkFavorite) {
            return res.status(200).json({
                msg: 'The book is already in your favorites',
                color: 'info',
                success: false
            });
        }
        yield models_1.Favorite.create({ bookId, userId: uid });
        const favorite = yield models_1.Book.findById(bookId);
        res.send({
            favorite,
            msg: 'The book has been added to your favorites',
            color: 'positive',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.addFavorite = addFavorite;
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, bookId } = req.body;
        const findFavorite = yield models_1.Favorite.findOne({ bookId, userId: uid });
        if (findFavorite) {
            yield models_1.Favorite.findOneAndRemove(findFavorite._id);
        }
        res.send({
            bookId,
            msg: 'The book has been removed from your favorites',
            color: 'positive',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.removeFavorite = removeFavorite;
const viewCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const cart = yield models_1.Cart.find({ userId });
        const cartBooks = new Array();
        yield Promise.all(cart.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
            const book = yield models_1.Book.findById(obj.bookId)
                .populate([
                { path: 'userId', select: 'id name lastName' },
                { path: 'categoryId', select: 'id category slug' },
            ]);
            cartBooks.push(book);
        })));
        const loans = yield models_1.Loan.find({ userId, status: 'Loan' }).select('id userId bookId');
        const loanBooks = new Array();
        yield Promise.all(loans.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
            const book = yield models_1.Book.findById(obj.bookId)
                .populate([
                { path: 'userId', select: 'id name lastName' },
                { path: 'categoryId', select: 'id category slug' },
            ]);
            loanBooks.push(book);
        })));
        res.send({
            cartBooks,
            loanBooks
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.viewCart = viewCart;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.body;
        yield models_1.Cart.deleteMany({ userId: uid });
        res.send({
            msg: 'The cart has been cleared',
            color: 'positive',
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.clearCart = clearCart;
const addCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, bookId } = req.body;
        const checkStock = yield models_1.Book.findById(bookId);
        if ((checkStock === null || checkStock === void 0 ? void 0 : checkStock.stock) === 0) {
            return res.status(400).json({
                msg: 'The book is out of stock',
            });
        }
        const checkCart = yield models_1.Cart.findOne({ bookId, userId });
        if (checkCart) {
            return res.status(200).json({
                msg: 'The book is already in your cart',
                color: 'info',
                success: false
            });
        }
        yield models_1.Cart.create({ bookId, userId });
        res.send({
            msg: 'The book has been added to your cart',
            color: 'positive',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.addCart = addCart;
const addCartFromFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, bookId } = req.body;
        const checkStock = yield models_1.Book.findById(bookId);
        if ((checkStock === null || checkStock === void 0 ? void 0 : checkStock.stock) === 0) {
            return res.status(400).json({
                msg: 'The book is out of stock',
            });
        }
        const checkCart = yield models_1.Cart.findOne({ bookId, userId: uid });
        if (checkCart) {
            return res.status(200).json({
                msg: 'The book is already in your cart',
                color: 'info',
                success: false
            });
        }
        yield models_1.Cart.create({ bookId, userId: uid });
        res.send({
            msg: 'The book has been added to your cart',
            color: 'positive',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.addCartFromFavorites = addCartFromFavorites;
const removeBookFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.body;
        const { bookId } = req.params;
        yield models_1.Cart.deleteOne({ bookId, userId: uid });
        res.send({
            success: true,
            bookId
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.removeBookFromCart = removeBookFromCart;
const getLoans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.body;
        const loans = yield models_1.Loan.find({ userId: uid, status: 'Loan' }).select('id userId bookId');
        const loanBooks = new Array();
        yield Promise.all(loans.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
            const book = yield models_1.Book.findById(obj.bookId)
                .populate([
                { path: 'userId', select: 'id name lastName' },
                { path: 'categoryId', select: 'id category slug' },
            ]);
            loanBooks.push(book);
        })));
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.getLoans = getLoans;
const requestLoan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.body;
        const checkNotification = yield models_1.Notification.findOne({ userId: uid });
        if (checkNotification) {
            return res.status(200).json({
                msg: 'You have already requested a loan, wait for the admin to approve it',
                color: 'orange',
                success: false
            });
        }
        const user = yield models_1.User.findById(uid).select('id name lastName');
        yield models_1.Notification.create({ userId: uid, text: `The user ${user.name} ${user.lastName} has requested a loan` });
        res.send({
            msg: 'The request has been sent',
            color: 'positive',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.requestLoan = requestLoan;
const acceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationId } = req.params;
        const notification = yield models_1.Notification.findById(notificationId);
        console.log(notification);
        const selectedUser = yield models_1.User.findById(notification.userId).select('id name lastName');
        yield models_1.Notification.findByIdAndRemove(notificationId);
        res.send({
            selectedUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.acceptRequest = acceptRequest;
const confirmLoan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, userId, cart } = req.body;
        const loanedBooks = new Array();
        let outOfStockCount = 0;
        yield Promise.all(cart.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
            const book = yield models_1.Book.findById(obj.id)
                .populate([
                { path: 'userId', select: 'id name lastName' },
                { path: 'categoryId', select: 'id category slug' },
            ]);
            if (book.stock > 0 && book.isActive) {
                yield models_1.Book.findByIdAndUpdate(book._id, { $inc: { stock: -1 } });
                yield models_1.Loan.create({ userId, bookId: book._id, authorizedId: uid });
                yield models_1.Cart.deleteOne({ bookId: book._id, userId });
                loanedBooks.push(book);
            }
            else {
                outOfStockCount++;
            }
        })));
        if (outOfStockCount > 0) {
            res.send({
                loanedBooks,
                msg: "One or more books don't have enough stock or are not active",
                color: 'warning',
            });
        }
        else {
            res.send({
                loanedBooks,
                msg: 'All books have been loaned',
                color: 'positive',
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.confirmLoan = confirmLoan;
const turInBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const { uid, userId } = req.body;
        yield models_1.Loan.findOneAndUpdate({ bookId, userId, status: 'Loan' }, { status: 'Returned', receivedId: uid });
        yield models_1.Book.findByIdAndUpdate(bookId, { $inc: { stock: 1 } });
        res.send({
            msg: 'The book has been returned',
            color: 'positive',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.turInBook = turInBook;
const turInAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, userId } = req.body;
        const loans = yield models_1.Loan.find({ userId, status: 'Loan' });
        yield Promise.all(loans.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
            yield models_1.Book.findByIdAndUpdate(obj.bookId, { $inc: { stock: 1 } });
            yield models_1.Loan.findOneAndUpdate({ bookId: obj.bookId, userId, status: 'Loan' }, { status: 'Returned', receivedId: uid });
        })));
        res.send({
            msg: 'The books have been returned',
            color: 'positive',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error in the server',
            error
        });
    }
});
exports.turInAllBooks = turInAllBooks;
//# sourceMappingURL=booksController.js.map