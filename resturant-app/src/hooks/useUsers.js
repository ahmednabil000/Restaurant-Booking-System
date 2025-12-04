import { useState, useCallback } from 'react';
import * as usersService from '../services/usersService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await usersService.getUsers(params);
      if (response && response.success) {
        setUsers(response.data?.users || []);
        return response.data;
      }
      return null;
    } catch (err) {
      setError(err.message || 'خطأ في تحميل المستخدمين');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      const response = await usersService.createUser(userData);
      return response;
    } catch (err) {
      setError(err.message || 'خطأ في إنشاء المستخدم');
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      const response = await usersService.updateUser(userId, userData);
      return response;
    } catch (err) {
      setError(err.message || 'خطأ في تحديث المستخدم');
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      const response = await usersService.deleteUser(userId);
      return response;
    } catch (err) {
      setError(err.message || 'خطأ في حذف المستخدم');
      throw err;
    }
  }, []);

  const assignRole = useCallback(async (userId, role) => {
    try {
      const response = await usersService.assignRole(userId, role);
      return response;
    } catch (err) {
      setError(err.message || 'خطأ في تعيين الدور');
      throw err;
    }
  }, []);

  const getUserStats = useCallback(async () => {
    try {
      const response = await usersService.getUserStats();
      return response;
    } catch (err) {
      setError(err.message || 'خطأ في تحميل إحصائيات المستخدمين');
      throw err;
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    assignRole,
    getUserStats,
    setError,
  };
};