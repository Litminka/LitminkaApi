import request from "supertest";
import { describe } from "node:test";
import { app } from '@/index';
import { RequestStatuses } from "@/ts/enums";
import prisma from "@/db";

describe("UserController.ts Login Test", () => {

    const testUser = {
        "login": "Test",
        "email": "test@test.ru",
        "name": "Testing",
        "password": "test11",
        "passwordConfirm": "test11"
      }
    let tempToken: string;
    test("Register test success", async() => {
        const response = await request(app).post("/users/register").send(testUser);
        expect(response.statusCode).toEqual(RequestStatuses.OK);
    }),
    test("Register test failed, user already registered", async() => {
        const response = await request(app).post("/users/register").send(testUser);
        expect(response.statusCode).toEqual(RequestStatuses.UnprocessableContent);
    }),
    test("Login test", async() => {
        const response = await request(app).post("/users/login").send({ login: "Test", password: "test11"});
        expect(response.statusCode).toEqual(RequestStatuses.OK);
        tempToken = response.body.data.token as string;
    }),
    test("Profile test", async() => {
        const response = await request(app).get("/users/profile").auth(tempToken,{type: "bearer"});
        expect(response.statusCode).toEqual(RequestStatuses.OK);
        expect(response.body).toHaveProperty("data.user.login", "Test");
    })
    
    /*
    beforeAll(async() =>{
        try{
        await prisma.user.delete({
            where: {
                email: testUser.email
            }
        })
        } catch(err){

        }
    });

    afterAll(async() =>{
        await prisma.user.delete({
            where: {
                email: testUser.email
            }
        })
    });*/
    
});

