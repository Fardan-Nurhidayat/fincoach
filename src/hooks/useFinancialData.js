import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/utils/api.js";
import { toast } from "react-toastify";
import { profilResiko } from "../utils/CardDashboard.js";

// Constants
const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const ENDPOINTS = {
  INCOME: "/income",
  EXPENSES: "/expenses",
  SAVINGS: "/savings",
  INVESTMENTS: "/investments",
};

// Initial state factory
const createInitialFinancialState = () => ({
  jumlah: 0,
  limit: 0,
});

// Error messages
const ERROR_MESSAGES = {
  FETCH_INCOME: "Gagal memuat data pemasukan.",
  FETCH_EXPENSES: "Gagal memuat data pengeluaran.",
  FETCH_SAVINGS: "Gagal memuat data tabungan.",
  FETCH_INVESTMENTS: "Gagal memuat data investasi.",
  FETCH_FINANCIAL: "Gagal memuat data keuangan.",
  POST_INCOME: "Gagal menambahkan pemasukan.",
  POST_EXPENSE: "Gagal menambahkan pengeluaran.",
  POST_SAVINGS: "Gagal menambahkan tabungan.",
  POST_INVESTMENT: "Gagal menambahkan investasi.",
  UPDATE_DATA: "Gagal menambahkan data",
  DELETE_DATA: "Gagal menghapus data",
};

export const useFinancialData = () => {
  // State management
  const [financialData, setFinancialData] = useState({
    income: { jumlah: 0, sumber: "" },
    expenses: createInitialFinancialState(),
    savings: createInitialFinancialState(),
    investments: createInitialFinancialState(),
  });

  const [derivedData, setDerivedData] = useState({
    sisa: 0,
    pemakaian: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized calculations
  const totalUsage = useMemo(() => {
    return (
      financialData.expenses.jumlah +
      financialData.savings.jumlah +
      financialData.investments.jumlah
    );
  }, [
    financialData.expenses.jumlah,
    financialData.savings.jumlah,
    financialData.investments.jumlah,
  ]);

  const remainingAmount = useMemo(() => {
    return financialData.income.jumlah - totalUsage;
  }, [financialData.income.jumlah, totalUsage]);

  // Update derived data when calculations change
  useEffect(() => {
    setDerivedData({
      sisa: remainingAmount,
      pemakaian: totalUsage,
    });
  }, [remainingAmount, totalUsage]);

  // Error handling utility
  const handleError = useCallback((error, message) => {
    console.error(message, error);
    setError(error);
    toast.error(message, TOAST_CONFIG);
  }, []);

  // API call wrapper with error handling
  const apiCall = useCallback(
    async (apiFunc, errorMessage) => {
      try {
        const result = await apiFunc();
        setError(null);
        return result;
      } catch (error) {
        handleError(error, errorMessage);
        return null;
      }
    },
    [handleError]
  );

  // Calculate limits based on income and risk profile
  const calculateLimits = useCallback(totalIncome => {
    return {
      expenses: (profilResiko.pengeluaran * totalIncome) / 100,
      savings: (profilResiko.tabungan * totalIncome) / 100,
      investments: (profilResiko.investasi * totalIncome) / 100,
    };
  }, []);

  // Fetch individual financial data
  const fetchFinancialCategory = useCallback(async (endpoint, category) => {
    const res = await api.get(endpoint);
    if (!res) return 0;

    const total = res.reduce((acc, item) => acc + Number(item[category]), 0);
    return { data: res, total };
  }, []);

  // Get all financial data
  const getAllFinancialData = useCallback(async () => {
    setLoading(true);
    try {
      const [incomeRes, expensesRes, savingsRes, investmentsRes] =
        await Promise.all([
          apiCall(() => api.get(ENDPOINTS.INCOME), ERROR_MESSAGES.FETCH_INCOME),
          apiCall(
            () => api.get(ENDPOINTS.EXPENSES),
            ERROR_MESSAGES.FETCH_EXPENSES
          ),
          apiCall(
            () => api.get(ENDPOINTS.SAVINGS),
            ERROR_MESSAGES.FETCH_SAVINGS
          ),
          apiCall(
            () => api.get(ENDPOINTS.INVESTMENTS),
            ERROR_MESSAGES.FETCH_INVESTMENTS
          ),
        ]);

      return {
        income: incomeRes || [],
        expenses: expensesRes || [],
        savings: savingsRes || [],
        investments: investmentsRes || [],
      };
    } catch (error) {
      handleError(error, ERROR_MESSAGES.FETCH_FINANCIAL);
      return {
        income: [],
        expenses: [],
        savings: [],
        investments: [],
      };
    } finally {
      setLoading(false);
    }
  }, [apiCall, handleError]);

  // Get income and update all related data
  const getIncome = useCallback(async () => {
    setLoading(true);

    try {
      const incomeResult = await fetchFinancialCategory(
        ENDPOINTS.INCOME,
        "income"
      );
      if (!incomeResult) return;

      const totalIncome = incomeResult.total;
      const limits = calculateLimits(totalIncome);

      // Fetch other financial data in parallel
      const [expensesResult, savingsResult, investmentsResult] =
        await Promise.all([
          fetchFinancialCategory(ENDPOINTS.EXPENSES, "expenses"),
          fetchFinancialCategory(ENDPOINTS.SAVINGS, "savings"),
          fetchFinancialCategory(ENDPOINTS.INVESTMENTS, "investments"),
        ]);

      // Update state in a single operation
      setFinancialData({
        income: { jumlah: totalIncome },
        expenses: {
          jumlah: expensesResult?.total || 0,
          limit: limits.expenses,
        },
        savings: {
          jumlah: savingsResult?.total || 0,
          limit: limits.savings,
        },
        investments: {
          jumlah: investmentsResult?.total || 0,
          limit: limits.investments,
        },
      });
    } catch (error) {
      handleError(error, ERROR_MESSAGES.FETCH_INCOME);
    } finally {
      setLoading(false);
    }
  }, [fetchFinancialCategory, calculateLimits, handleError]);

  // Generic data fetcher with sorting
  const getData = useCallback(async ({ path, name }) => {
    try {
      const res = await api.get(path);
      if (!res) return [];

      return [...res].sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      toast.error(`Gagal memuat data ${name}`, TOAST_CONFIG);
      return [];
    }
  }, []);

  // Get detail data
  const getDetailData = useCallback(async ({ path, id, name }) => {
    try {
      const res = await api.get(`${path}/${id}`);
      return res || {};
    } catch (error) {
      toast.error(`Gagal memuat data ${name}`, TOAST_CONFIG);
      return {};
    }
  }, []);

  // Generic update function
  const updateData = useCallback(async ({ path, id, body, name, tipe }) => {
    try {
      const res = await api.put(`${path}/${id}`, body);
      toast.success(
        `Berhasil menambahkan ${name} dengan nilai Rp. ${body[
          tipe
        ].toLocaleString("id-ID")}`,
        TOAST_CONFIG
      );
      return res;
    } catch (error) {
      toast.error(`${ERROR_MESSAGES.UPDATE_DATA} ${name}`, TOAST_CONFIG);
      throw error;
    }
  }, []);

  // Generic delete function
  const deleteData = useCallback(async ({ path, id, name }) => {
    try {
      await api.delete(`${path}/${id}`);
      toast.success("Berhasil menghapus data", TOAST_CONFIG);
      return true;
    } catch (error) {
      toast.error(
        `${ERROR_MESSAGES.DELETE_DATA} ${name}. Mohon coba lagi`,
        TOAST_CONFIG
      );
      return false;
    }
  }, []);

  // Post functions with optimistic updates
  const postIncome = useCallback(
    async (incomeAmount, source) => {
      const result = await apiCall(
        () =>
          api.post(ENDPOINTS.INCOME, {
            income: incomeAmount,
            source: source,
            date: new Date().toISOString(),
          }),
        ERROR_MESSAGES.POST_INCOME
      );

      if (result) {
        toast.success("Pemasukan berhasil ditambahkan!", TOAST_CONFIG);
        await getIncome(); // Refresh all data
        return true;
      }
      return false;
    },
    [apiCall, getIncome]
  );

  const postExpense = useCallback(
    async (amount, category) => {
      const result = await apiCall(
        () =>
          api.post(ENDPOINTS.EXPENSES, {
            expenses: amount,
            category: category,
            date: new Date().toISOString(),
          }),
        ERROR_MESSAGES.POST_EXPENSE
      );

      if (result) {
        // Optimistic update
        setFinancialData(prev => ({
          ...prev,
          expenses: {
            ...prev.expenses,
            jumlah: prev.expenses.jumlah + amount,
          },
        }));

        toast.success(
          `Pengeluaran Rp. ${amount.toLocaleString(
            "id-ID"
          )} untuk ${category} berhasil ditambahkan!`,
          TOAST_CONFIG
        );
        return true;
      }
      return false;
    },
    [apiCall]
  );

  const postSavings = useCallback(
    async (amount, goal) => {
      const result = await apiCall(
        () =>
          api.post(ENDPOINTS.SAVINGS, {
            savings: amount,
            goal: goal,
            date: new Date().toISOString(),
          }),
        ERROR_MESSAGES.POST_SAVINGS
      );

      if (result) {
        // Optimistic update
        setFinancialData(prev => ({
          ...prev,
          savings: {
            ...prev.savings,
            jumlah: prev.savings.jumlah + amount,
          },
        }));

        toast.success(
          `Tabungan Rp. ${amount.toLocaleString(
            "id-ID"
          )} untuk ${goal} berhasil ditambahkan!`,
          TOAST_CONFIG
        );
        return true;
      }
      return false;
    },
    [apiCall]
  );

  const postInvestment = useCallback(
    async (amount, instrument) => {
      const result = await apiCall(
        () =>
          api.post(ENDPOINTS.INVESTMENTS, {
            investments: amount,
            instrument: instrument,
            date: new Date().toISOString(),
          }),
        ERROR_MESSAGES.POST_INVESTMENT
      );

      if (result) {
        // Optimistic update
        setFinancialData(prev => ({
          ...prev,
          investments: {
            ...prev.investments,
            jumlah: prev.investments.jumlah + amount,
          },
        }));

        toast.success(
          `Investasi Rp. ${amount.toLocaleString(
            "id-ID"
          )} pada ${instrument} berhasil ditambahkan!`,
          TOAST_CONFIG
        );
        return true;
      }
      return false;
    },
    [apiCall]
  );

  // Refresh data function
  const refreshData = useCallback(() => {
    getIncome();
  }, [getIncome]);

  // Initialize data on mount
  useEffect(() => {
    getIncome();
  }, [getIncome]);

  // Return hook interface
  return {
    // State
    income: financialData.income,
    expensesState: financialData.expenses,
    savingsState: financialData.savings,
    investmentsState: financialData.investments,
    sisa: derivedData.sisa,
    pemakaian: derivedData.pemakaian,
    loading,
    error,

    // Actions
    postIncome,
    postExpense,
    postSavings,
    postInvestment,
    refreshData,

    // Utilities
    getAllFinancialData,
    getData,
    getDetailData,
    updateData,
    deleteData,

    // Config (deprecated, keep for backward compatibility)
    toastConfig: TOAST_CONFIG,
  };
};
