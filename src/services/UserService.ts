import BaseService from './BaseService';
import { User, UserResponse, LoginResponse, PaginatedResponse } from '../interfaces/interfaces';

class UserService extends BaseService {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL, {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  async createUser(user: User): Promise<UserResponse> {
    return this.post<UserResponse>('/User', user);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>('/User/Login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  }

  async getUsersPaginated(pageNumber: number, pageSize: number): Promise<PaginatedResponse<User>> {
    return this.get<PaginatedResponse<User>>('/User/Paginated', { params: { pageNumber, pageSize } });
  }

  async getUsers(): Promise<User[]> {
    return this.get<User[]>('/User');
  }

  async updateUser(id: number, user: User): Promise<User> {
    return this.put<User>(`/User/${id}`, user);
  }

  async deleteUser(id: number): Promise<void> {
    return this.delete(`/User/${id}`);
  }

  async refreshAuthToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await this.post<LoginResponse>('/User/RefreshToken', { refreshToken });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  }
}

export default new UserService();
