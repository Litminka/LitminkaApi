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
const sleep_1 = __importDefault(require("./sleep"));
class TokenBucketRateLimiter {
    constructor(maxRequests, maxRequestWindowMS) {
        this.count = 0;
        this.resetTimeout = null;
        this.maxRequests = maxRequests;
        this.maxRequestWindowMS = maxRequestWindowMS;
        this.reset();
    }
    reset() {
        this.count = 0;
        this.resetTimeout = null;
    }
    scheduleReset() {
        // Only the first token in the set triggers the resetTimeout
        if (!this.resetTimeout) {
            this.resetTimeout = setTimeout(() => (this.reset()), this.maxRequestWindowMS);
        }
    }
    acquireToken(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            this.scheduleReset();
            if (this.count === this.maxRequests) {
                yield (0, sleep_1.default)(this.maxRequestWindowMS);
                return this.acquireToken(fn);
            }
            this.count += 1;
            return fn();
        });
    }
}
exports.default = TokenBucketRateLimiter;
//# sourceMappingURL=tokenbucket.js.map