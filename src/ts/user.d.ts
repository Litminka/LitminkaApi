import { Integration, User, UserSettings, SessionToken } from '@prisma/client';
import { RoleWithPermissions } from '@/ts/role';

type UserWithoutPassword = Omit<User, 'password'>;

type NonSensetiveIntegration = Omit<
    Integration,
    'userId' | 'shikimoriCode' | 'shikimoriRefreshToken' | 'shikimoriToken'
>;

export type UserWithIntegration = UserWithoutPassword & {
    integration: Integration | null;
};

export type UserProfile = UserWithoutPassword & {
    integration: NonSensetiveIntegration | null;
    settings: UserSettings | null;
};

type UserWithTokens = UserWithoutPassword & {
    sessionTokens: SessionToken[];
};

export type UserWithPermissions = UserWithoutPassword & {
    role?: RoleWithPermissions;
};

export interface LoginUser {
    password: string;
    login: string;
}

export interface CreateUser extends LoginUser {
    email: string;
    name?: string;
}
