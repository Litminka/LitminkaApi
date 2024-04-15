import { UserWithPermissions } from '@/ts/user';
import { Permissions } from '@enums';

export default function hasPermissions(permissions: Permissions[], user?: UserWithPermissions) {
    if (permissions.length < 1) return true;

    if (!user) return false;

    if (user.role === undefined || user.role.permissions === undefined) return false;

    const permissionNames = user.role.permissions.map((perm) => {
        return perm.name;
    });

    const hasPermissions = permissions.every((permission) => {
        return permissionNames.includes(permission);
    });

    return hasPermissions;
}
