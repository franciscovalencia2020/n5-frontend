import BaseService from './BaseService';
import { PermissionType, PaginatedResponse } from '../interfaces/interfaces';

class PermissionTypeService extends BaseService {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL, {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  async createPermissionType(PermissionType: PermissionType): Promise<PermissionType> {
    return this.post<PermissionType>('/PermissionType', PermissionType);
  }

  async getPermissionsTypePaginated(pageNumber: number, pageSize: number): Promise<PaginatedResponse<PermissionType>> {
    return this.get<PaginatedResponse<PermissionType>>('/PermissionType/Paginated', { params: { pageNumber, pageSize } });
  }

  async getPermissionsType(): Promise<PermissionType[]> {
    return this.get<PermissionType[]>('/PermissionType');
  }

  async updatePermissionType(id: number, PermissionType: PermissionType): Promise<PermissionType> {
    return this.put<PermissionType>(`/PermissionType/${id}`, PermissionType);
  }

  async deletePermissionType(id: number): Promise<void> {
    return this.delete(`/PermissionType/${id}`);
  }

}

export default new PermissionTypeService();
