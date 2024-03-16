import request from "supertest";
import { describe } from "node:test";
import { app } from '../../src/index';
import { RequestStatuses } from "../../src/ts/enums";

describe("UserController.ts Login Test", () => {
    let tempToken: string;
    test("Register test", async() => {
        const response = await request(app).post("/users/register").send({
            "login": "Test1",
            "email": "test1@test.ru",
            "name": "Testing1",
            "password": "test123",
            "passwordConfirm": "test123"
          });
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
        tempToken = "";
    })
    
});

