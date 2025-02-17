import { useState, useCallback, useEffect } from 'react';
import UserService from '../services/UserService';
import { User, PaginatedResponse } from '@interfaces/interfaces';
import { AxiosError } from 'axios';

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [showSessionModal, setShowSessionModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const response: PaginatedResponse<User> = await UserService.getUsersPaginated(
        paginationModel.page + 1,
        paginationModel.pageSize
      );
      setUsers(response.items);
      setTotalCount(response.totalCount);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ERR_NETWORK') {
          setShowSessionModal(true);
        } else if (error.response?.status === 401) {
          setShowSessionModal(true);
        }
      }
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, totalCount, paginationModel, setPaginationModel, fetchUsers, showSessionModal, setShowSessionModal };
};

export default useUsers;
