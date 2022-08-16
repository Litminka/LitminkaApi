"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jwt = __importStar(require("jsonwebtoken"));
function auth(req, res, next) {
    const token = req.get("authorization");
    if (!token)
        return res.status(403).json({
            data: {
                message: "No token provided",
            }
        });
    const result = token.split(" ")[1];
    jwt.verify(result, process.env.tokenSecret, function (err, decoded) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ "error": true, "message": 'Token expired' });
        }
        if (err) {
            return res.status(500).json({ "error": true, "message": "Failed to authenticate token" });
        }
        req.auth = decoded;
        if (!req.auth)
            return res.status(403).json({
                data: {
                    message: "Unauthorized",
                }
            });
        next();
    });
}
exports.auth = auth;
//# sourceMappingURL=auth.js.map