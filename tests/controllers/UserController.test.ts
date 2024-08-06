import request from 'supertest';
import { describe } from 'node:test';
import { app } from '@/index';
import { RequestStatuses } from '@enums';
import prisma from '@/db';
import crypto from 'crypto';
import { registrationMsg } from '@/ts/messages';

const defTestLogin = 'Test';
const defTestEmail = 'test@test.ru';
const defTestName = 'Testing';
const defTestPassword = 'test11';

export const testUser = {
    login: defTestLogin,
    email: defTestEmail,
    name: defTestName,
    password: defTestPassword,
    passwordConfirm: defTestPassword
};

const diffPassword: string = 'wrongPass';
const diffLogin: string = 'Lipton';
const smallPassword: string = 'abcd';
const smallName: string = 'Tes';
const incorrectEmail: string = 'test@test';

export async function testRegister(user: any) {
    return await request(app).post('/users/register').send(user);
}

export async function removeUser(login: string) {
    const user = await prisma.user.findUserByLogin(login);
    if (user) await prisma.user.deleteUserById(user.id);
}

describe('UserController.ts Tests', async () => {
    let defTestToken: string;
    let diffTestToken: string;

    beforeAll(async () => {
        removeUser(defTestLogin);
        diffTestToken = crypto.randomBytes(64).toString('hex');
    });

    afterAll(async () => {
        removeUser(defTestLogin);
        diffTestToken = '';
        defTestToken = '';
    });

    describe('Register tests', async () => {
        test('Register successful', async () => {
            const response = await testRegister(testUser);
            expect(response.statusCode).toEqual(RequestStatuses.OK);
        }),
            test('Register failed, user already registered', async () => {
                const response = await testRegister(testUser);
                expect(response.statusCode).toEqual(RequestStatuses.UnprocessableContent);
            }),
            test('Register failed, login taken', async () => {
                const response = await testRegister(testUser);
                expect(response.statusCode).toEqual(RequestStatuses.UnprocessableContent);
                expect(response.body).toHaveProperty('errors[0].path', 'login');
                expect(response.body).toHaveProperty('errors[0].msg', registrationMsg.loginTaken);
            }),
            test('Register failed, email taken', async () => {
                const response = await testRegister(testUser);
                expect(response.statusCode).toEqual(RequestStatuses.UnprocessableContent);
                expect(response.body).toHaveProperty('errors[1].path', 'email');
                expect(response.body).toHaveProperty('errors[1].msg', registrationMsg.emailTaken);
            }),
            test('Register failed, email incorrect', async () => {
                testUser.email = incorrectEmail;
                const response = await testRegister(testUser);
                expect(response.statusCode).toEqual(RequestStatuses.UnprocessableContent);
                expect(response.body).toHaveProperty('errors[1].path', 'email');
                expect(response.body).toHaveProperty('errors[1].msg', registrationMsg.invalidEmail);
                testUser.email = defTestEmail;
            }),
            test("Register failed, passwords doesn't match", async () => {
                testUser.passwordConfirm = diffPassword;
                const response = await testRegister(testUser);
                expect(response.statusCode).toEqual(RequestStatuses.UnprocessableContent);
                expect(response.body).toHaveProperty('errors[2].path', 'passwordConfirm');
                expect(response.body).toHaveProperty(
                    'errors[2].msg',
                    registrationMsg.passwordsDontMatch
                );
                testUser.passwordConfirm = defTestPassword;
            }),
            test('Register failed, password is too small', async () => {
                testUser.password = smallPassword;
                const response = await testRegister(testUser);
                expect(response.statusCode).toEqual(RequestStatuses.UnprocessableContent);
                expect(response.body).toHaveProperty('errors[2].path', 'password');
                expect(response.body).toHaveProperty(
                    'errors[2].msg',
                    registrationMsg.passwordTooShort
                );
                testUser.password = defTestPassword;
            }),
            test('Register failed, name is too small', async () => {
                testUser.name = smallName;
                const response = await testRegister(testUser);
                expect(response.statusCode).toEqual(RequestStatuses.UnprocessableContent);
                expect(response.body).toHaveProperty('errors[2].path', 'name');
                expect(response.body).toHaveProperty('errors[2].msg', registrationMsg.nameTooShort);
                testUser.name = defTestName;
            });
    }),
        describe('Login tests', async () => {
            test('Login successful', async () => {
                const response = await request(app)
                    .post('/users/login')
                    .send({ login: defTestLogin, password: defTestPassword });
                expect(response.statusCode).toEqual(RequestStatuses.OK);
                defTestToken = response.body.data.token as string;
            }),
                test('Login failed, wrong password', async () => {
                    const response = await request(app)
                        .post('/users/login')
                        .send({ login: defTestLogin, password: diffPassword });
                    expect(response.statusCode).toEqual(RequestStatuses.Unauthorized);
                    expect(response.body).toHaveProperty('error', 'Login or password incorrect');
                }),
                test('Login failed, wrong login', async () => {
                    const response = await request(app)
                        .post('/users/login')
                        .send({ login: diffLogin, password: defTestPassword });
                    expect(response.statusCode).toEqual(RequestStatuses.Unauthorized);
                    expect(response.body).toHaveProperty('error', 'Login or password incorrect');
                }),
                test('Login failed, no data provided', async () => {
                    const response = await request(app).post('/users/login');
                    expect(response.statusCode).toEqual(RequestStatuses.UnprocessableContent);
                    expect(response.body.errors).not.toBeNull();
                });
        }),
        describe('Profile tests', async () => {
            test('Got user profile', async () => {
                const response = await request(app)
                    .get('/users/profile')
                    .auth(defTestToken, { type: 'bearer' });
                expect(response.statusCode).toEqual(RequestStatuses.OK);
                expect(response.body).toHaveProperty('data.user.login', defTestLogin);
            }),
                test('Getting profile failed, wrong token', async () => {
                    const response = await request(app)
                        .get('/users/profile')
                        .auth(diffTestToken, { type: 'bearer' });
                    expect(response.statusCode).toEqual(RequestStatuses.InternalServerError);
                    expect(response.body).toHaveProperty('message', 'Failed to authenticate token');
                });
        });
});
