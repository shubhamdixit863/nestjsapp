type RoleObject = {
    name: string;
    permission: string;
};
export class RoleConverter {
    roles: RoleObject[];

    constructor(roles: RoleObject[]) {
        this.roles = roles;
    }

    convertToStringRole(): string {
        let rolesString = '';

        for (let i = 0; i < this.roles.length; i++) {
            let role = this.roles[i];

            if (role.name) {
                rolesString += role.name;
                if (i < this.roles.length - 1) {
                    rolesString += ';';
                }
            }
        }

        return rolesString;
    }

    convertToStringPermissions(): string {
        let permissionsString = '';

        for (let i = 0; i < this.roles.length; i++) {
            let role = this.roles[i];

            if (role.permission) {
                permissionsString += role.permission;
                if (i < this.roles.length - 1) {
                    permissionsString += ';';
                }
            }
        }

        return permissionsString;
    }
}

