import BaseService from './BaseService';
import { UserPermission, PaginatedResponse } from '../interfaces/interfaces';

class UserPermissionService extends BaseService {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL, {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  async createUserPermission(userPermission: UserPermission): Promise<UserPermission> {
    return this.post<UserPermission>('/UserPermission', userPermission);
  }

  async getUserPermissionsPaginated(pageNumber: number, pageSize: number): Promise<PaginatedResponse<UserPermission>> {
    return this.get<PaginatedResponse<UserPermission>>('/UserPermission/Paginated', { params: { pageNumber, pageSize } });
  }

  async getUserPermissions(): Promise<UserPermission[]> {
    return this.get<UserPermission[]>('/UserPermission');
  }

  async getUserPermissionsByUserId(id: number): Promise<UserPermission[]> {
    return this.get<UserPermission[]>(`/UserPermission/ByUserId/${id}`);
  }

  async updateUserPermission(id: number, userPermission: UserPermission): Promise<UserPermission> {
    return this.put<UserPermission>(`/UserPermission/${id}`, userPermission);
  }

  async deleteUserPermission(id: number): Promise<void> {
    return this.delete(`/UserPermission/${id}`);
  }

}

export default new UserPermissionService();
