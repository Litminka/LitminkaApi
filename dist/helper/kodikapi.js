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
const node_fetch_1 = __importDefault(require("node-fetch"));
class KodikApi {
    constructor() {
        this.baseurl = "https://kodikapi.com";
    }
    getAnime(shikimori_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                "token": process.env.kodik_api_key,
                "shikimori_id": shikimori_id.toString(),
            });
            const response = yield (0, node_fetch_1.default)(`${this.baseurl}/search`, {
                method: "POST",
                body: params
            });
            if (response.status !== 200)
                return { reqStatus: 500, message: "Server error" };
            return yield response.json();
        });
    }
    getFullAnime(shikimori_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                "token": process.env.kodik_api_key,
                "shikimori_id": shikimori_id.toString(),
                "with_material_data": "true"
            });
            const response = yield (0, node_fetch_1.default)(`${this.baseurl}/search`, {
                method: "POST",
                body: params
            });
            if (response.status !== 200)
                return { reqStatus: 500, message: "Server error" };
            const res = yield response.json();
            res.shikimori_request = shikimori_id.toString();
            return res;
        });
    }
    getGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                "token": process.env.kodik_api_key,
                "genres_type": "shikimori",
            });
            const response = yield (0, node_fetch_1.default)(`${this.baseurl}/genres`, {
                method: "POST",
                body: params
            });
            if (response.status !== 200)
                return { reqStatus: 500, message: "Server error" };
            return yield response.json();
        });
    }
}
exports.default = KodikApi;
//# sourceMappingURL=kodikapi.js.map