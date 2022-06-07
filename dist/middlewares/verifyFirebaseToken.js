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
exports.checkIfAuthenticated = void 0;
const firebaseAdmin_1 = __importDefault(require("../config/firebaseAdmin"));
const getAuthToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    try {
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            req.authToken = authorization.split(' ')[1];
        }
        else {
            req.authToken = null;
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al verificar el token',
            resetUser: true
        });
    }
};
const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { authToken } = req;
            const userInfo = yield firebaseAdmin_1.default.auth().verifyIdToken(authToken);
            req.body.uid = userInfo.uid;
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({
                msg: 'Token no válido',
                resetUser: true
            });
        }
    }));
};
exports.checkIfAuthenticated = checkIfAuthenticated;
// export const validateToken = async(req:IRequest, res:Response, next:any) => {
//   const authorization:any = req.headers.authorization;
//   try {
//     if(authorization && authorization.split(' ')[0] === 'Bearer'){
//       req.token = authorization.split(' ')[1];
//     }
//     else {
//       return res.status(401).json({
//         msg:'No hay token en la petición'
//       });
//     }
//     console.log(req.token)
//     const decodeToken = await admin.auth().verifyIdToken(req.token);
//     console.log(decodeToken)
//     req.body.decodeToken = decodeToken;
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({
//       msg:'Token no válido',
//       resetUser:true
//     });
//   }
// }
//# sourceMappingURL=verifyFirebaseToken.js.map