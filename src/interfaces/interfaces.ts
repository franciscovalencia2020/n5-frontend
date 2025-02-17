export interface BaseInterface {
    id: number;
    createdDate?: string;
    updatedDate?: string;
    isDeleted: boolean;
}

export interface User extends BaseInterface {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserResponse extends BaseInterface {
    firstName: string;
    lastName: string;
    email: string;
    refreshToken?: string;
    tokenExploration?: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface PermissionType extends BaseInterface {
    description: string;
}

export interface Permission extends BaseInterface {
    permissionTypeId: number;
    description: string;
}


export interface UserPermission extends BaseInterface {
    userId: number;
    permissionId: number;
    permission?: Permission;
    uiser?: User;
}
