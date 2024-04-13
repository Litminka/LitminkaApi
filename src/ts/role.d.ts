import { Permission, Role } from '@prisma/client';

interface RoleWithPermissions extends Role {
    permissions: Permission[];
}
