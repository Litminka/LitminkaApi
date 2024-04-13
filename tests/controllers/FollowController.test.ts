import request from 'supertest';
import { describe } from 'node:test';
import { app } from '@/index';
import { RequestStatuses } from '@/ts/enums';

export const followTests = describe('FollowController.ts Tests', async () => {
    describe('Follow tests', async () => {
        test('Follow successful', async () => {});
    }),
        describe('Unfollow tests', async () => {
            test('Unfollow successful', async () => {});
        });
});
