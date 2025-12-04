import { useState, useCallback } from 'react';
import * as rolesService from '../services/rolesService';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRoles = useCallback(async (includeInactive = false) => {
    setLoading(true);
    setError('');
    try {
      const response = await rolesService.getRoles(includeInactive);
      if (response && response.success) {
        setRoles(response.data?.roles || []);
        return response.data;
      }
      return null;
    } catch (err) {
      setError(err.message || 'خطأ في تحميل الأدوار');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRoleById = useCallback(async (roleId) => {
    try {
      const response = await rolesService.getRoleById(roleId);
      return response;
    } catch (err) {
      setError(err.message || 'خطأ في تحميل الدور');
      throw err;
    }
  }, []);

  const createRole = useCallback(async (roleData) => {
    try {
      const response = await rolesService.createRole(roleData);
      return response;
    } catch (err) {
      setError(err.message || 'خطأ في إنشاء الدور');
      throw err;
    }
  }, []);

  const updateRole = useCallback(async (roleId, roleData) => {
    try {
      const response = await rolesService.updateRole(roleId, roleData);
      return response;
    } catch (err) {
      setError(err.message || 'خطأ في تحديث الدور');
      throw err;
    }
  }, []);

  const deleteRole = useCallback(async (roleId) => {
    try {
      const response = await rolesService.deleteRole(roleId);
      return response;
    } catch (err) {
      setError(err.message || 'خطأ في حذف الدور');
      throw err;
    }
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    setError,
  };
};