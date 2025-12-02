import { useState, useEffect, useCallback } from "react";
import * as branchesService from "../services/branchesService";

export const useBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBranches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await branchesService.getAllBranches();

      if (response.success) {
        const branchesData = Array.isArray(response.data) ? response.data : [];
        setBranches(branchesData);
        setError(null);
      } else {
        setError(response.error || "خطأ في تحميل الفروع");
      }
    } catch (err) {
      setError(err.message || "خطأ في تحميل الفروع");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  // Helper functions
  const getActiveBranches = () => {
    return branches.filter((branch) => branch.isActive);
  };

  const getBranchById = (id) => {
    return branches.find((branch) => branch.id === id);
  };

  const getBranchesByCity = (city) => {
    return branches.filter((branch) =>
      branch.city.toLowerCase().includes(city.toLowerCase())
    );
  };

  const getBranchesByCountry = (country) => {
    return branches.filter((branch) =>
      branch.country.toLowerCase().includes(country.toLowerCase())
    );
  };

  const searchBranches = (searchTerm) => {
    if (!searchTerm) return branches;

    const term = searchTerm.toLowerCase();
    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(term) ||
        branch.address.toLowerCase().includes(term) ||
        branch.city.toLowerCase().includes(term) ||
        branch.state.toLowerCase().includes(term) ||
        branch.landmark?.toLowerCase().includes(term)
    );
  };

  const formatOpeningHours = (openingHours) => {
    if (!openingHours) return "غير محدد";

    const days = {
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      sunday: "الأحد",
    };

    const formatTime = (time) => {
      if (!time) return "";
      return time.substring(0, 5); // Remove seconds
    };

    const formattedHours = [];
    Object.entries(openingHours).forEach(([day, hours]) => {
      if (hours && hours.open && hours.close) {
        formattedHours.push({
          day: days[day] || day,
          hours: `${formatTime(hours.open)} - ${formatTime(hours.close)}`,
        });
      }
    });

    return formattedHours;
  };

  const getBranchesStats = () => {
    const total = branches.length;
    const active = branches.filter((branch) => branch.isActive).length;
    const inactive = total - active;

    const citiesCount = [...new Set(branches.map((branch) => branch.city))]
      .length;
    const countriesCount = [
      ...new Set(branches.map((branch) => branch.country)),
    ].length;

    return {
      total,
      active,
      inactive,
      citiesCount,
      countriesCount,
    };
  };

  return {
    branches,
    loading,
    error,
    refreshBranches: loadBranches,
    // Helper functions
    getActiveBranches,
    getBranchById,
    getBranchesByCity,
    getBranchesByCountry,
    searchBranches,
    formatOpeningHours,
    getBranchesStats,
  };
};
