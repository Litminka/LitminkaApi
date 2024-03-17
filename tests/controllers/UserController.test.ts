import request from "supertest";
import { describe } from "node:test";
import { app } from '../../src/index';
import { RequestStatuses } from "../../src/ts/enums";
import prisma from "../../src/db";

describe("UserController.ts Login Test", () => {
    const testUser = {
        "login": "Test",
        "email": "test@test.ru",
        "name": "Testing",
        "password": "test",
        "passwordConfirm": "test"
      }
    let tempToken: string;
    test("Register test success", async() => {
        const response = await request(app).post("/users/register").send(testUser);
        expect(response.statusCode).not.toEqual(RequestStatuses.OK);
    }),
    test("Login test", async() => {
        const response = await request(app).post("/users/login").send({ login: "Test1", password: "test123"});
        expect(response.statusCode).toEqual(RequestStatuses.OK);
        tempToken = response.body.data.token as string;
    }),
    test("Profile test", async() => {
        console.log(tempToken);
        const response = await request(app).get("/users/profile").auth(tempToken,{type: "bearer"});
        expect(response.statusCode).toEqual(RequestStatuses.OK);
        expect(response.body).toHaveProperty("data.user.login", "Test1");
    })
    
    afterAll(async() =>{
        await prisma.user.delete({
            where: {
                email: testUser.email
            }
        })
    });
    
});

