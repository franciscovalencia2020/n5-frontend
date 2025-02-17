import BaseService from './BaseService';
import { Permission, PaginatedResponse } from '../interfaces/interfaces';

class PermissionService extends BaseService {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL, {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  async createPermission(Permission: Permission): Promise<Permission> {
    return this.post<Permission>('/Permission', Permission);
  }

  async getPermissionsPaginated(pageNumber: number, pageSize: number): Promise<PaginatedResponse<Permission>> {
    return this.get<PaginatedResponse<Permission>>('/Permission/Paginated', { params: { pageNumber, pageSize } });
  }

  async getPermissions(): Promise<Permission[]> {
    return this.get<Permission[]>('/Permission');
  }

  async updatePermission(id: number, Permission: Permission): Promise<Permission> {
    return this.put<Permission>(`/Permission/${id}`, Permission);
  }

  async deletePermission(id: number): Promise<void> {
    return this.delete(`/Permission/${id}`);
  }

}

export default new PermissionService();
