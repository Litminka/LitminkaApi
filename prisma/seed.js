/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const adminRole = yield prisma.role.upsert({
            where: { name: "admin" },
            update: {},
            create: {
                name: "admin",
                permissions: {
                    connectOrCreate: [
                        {
                            where: { name: "manage_anime" },
                            create: {
                                name: "manage_anime"
                            },
                        },
                        {
                            where: { name: "view_lists" },
                            create: {
                                name: "view_lists"
                            },
                        },
                    ]
                }
            }
        });
        const userRole = yield prisma.role.upsert({
            where: { name: "user" },
            update: {},
            create: {
                name: "user",
            }
        });
        const admin = yield prisma.user.upsert({
            where: { email: 'admin@admin.ru' },
            update: {},
            create: {
                email: "admin@admin.ru",
                login: process.env.root_login,
                password: process.env.root_pass,
                name: "Admin",
                role: {
                    connect: {
                        id: adminRole.id
                    }
                }
            },
        });
        const user = yield prisma.user.upsert({
            where: { email: 'user@user.ru' },
            update: {},
            create: {
                email: "user@user.ru",
                login: "User",
                password: "password",
                name: "user",
                role: {
                    connect: {
                        id: userRole.id
                    }
                }
            },
        });
        console.dir(admin);
        console.dir(user);
    });
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
//# sourceMappingURL=seed.js.map