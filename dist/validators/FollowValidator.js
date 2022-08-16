"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowValidation = void 0;
const express_validator_1 = require("express-validator");
const FollowValidation = () => {
    return [
        (0, express_validator_1.body)("group_name").notEmpty().isString().bail(),
        (0, express_validator_1.param)("anime_id").notEmpty().isInt().bail().toInt()
    ];
};
exports.FollowValidation = FollowValidation;
//# sourceMappingURL=FollowValidator.js.map