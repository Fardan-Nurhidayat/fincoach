import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { api } from "@/utils/api.js";
import { toast } from "react-toastify";

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
  PROFILE_RISK: "/risk-profile",
};

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
  GET_PROFILE_RISK:
    "Gagal memuat profile resiko , coba periksa jaringan internet anda",
  POST_PROFILE_RISK: "Gagal menambahkan profile resiko",
  PUT_PROFILE_RISK: "Gagal memperbaui profile resiko",
  UPDATE_DATA: "Gagal menambahkan data",
  DELETE_DATA: "Gagal menghapus data",
};

const createInitialFinancialState = () => ({
  jumlah: 0,
  limit: 0,
});

export const useFinancialData = () => {
  // State
  const [financialData, setFinancialData] = useState({
    income: { jumlah: 0, sumber: "" },
    expenses: createInitialFinancialState(),
    savings: createInitialFinancialState(),
    investments: createInitialFinancialState(),
  });
  const [profileRisk, setProfileRisk] = useState(null);
  const [derivedData, setDerivedData] = useState({ sisa: 0, pemakaian: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);

  // Optimistic update helpers
  const needsUpdate = useRef(false);

  // Derived
  const totalUsage = useMemo(
    () =>
      financialData.expenses.jumlah +
      financialData.savings.jumlah +
      financialData.investments.jumlah,
    [
      financialData.expenses.jumlah,
      financialData.savings.jumlah,
      financialData.investments.jumlah,
    ]
  );

  const remainingAmount = useMemo(
    () => financialData.income.jumlah - totalUsage,
    [financialData.income.jumlah, totalUsage]
  );

  useEffect(() => {
    setDerivedData({
      sisa: remainingAmount,
      pemakaian: totalUsage,
    });
  }, [remainingAmount, totalUsage]);

  // Error handler
  const handleError = useCallback((error, message) => {
    console.error(message, error);
    setError(error);
    toast.error(message, TOAST_CONFIG);
  }, []);

  // API call wrapper
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

  // Limit calculation
  const calculateLimits = useCallback((totalIncome, riskProfile) => {
    if (!riskProfile || !riskProfile.expensesLimit) {
      return { expenses: 0, savings: 0, investments: 0 };
    }
    return {
      expenses: (riskProfile.expensesLimit * totalIncome) / 100,
      savings: (riskProfile.savingsLimit * totalIncome) / 100,
      investments: (riskProfile.investmentsLimit * totalIncome) / 100,
    };
  }, []);

  // Fetch category
  const fetchFinancialCategory = useCallback(async (endpoint, key) => {
    const res = await api.get(endpoint);
    if (!res) return { data: [], total: 0 };
    const total = res.reduce((acc, item) => acc + Number(item[key]), 0);
    return { data: res, total };
  }, []);

  // Fetch all
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
      return { income: [], expenses: [], savings: [], investments: [] };
    } finally {
      setLoading(false);
    }
  }, [apiCall, handleError]);

  // Update all financial state
  const updateFinancialData = useCallback((totals, limits) => {
    setFinancialData({
      income: { jumlah: totals.income },
      expenses: { jumlah: totals.expenses, limit: limits.expenses },
      savings: { jumlah: totals.savings, limit: limits.savings },
      investments: { jumlah: totals.investments, limit: limits.investments },
    });
    setDataVersion(v => v + 1);
  }, []);

  // Get income & related
  const getIncome = useCallback(
    async (customProfileRisk = null) => {
      setLoading(true);
      try {
        const incomeResult = await fetchFinancialCategory(
          ENDPOINTS.INCOME,
          "income"
        );
        if (!incomeResult) return;

        const totalIncome = incomeResult.total;
        const currentProfileRisk = customProfileRisk || profileRisk;
        const limits = calculateLimits(totalIncome, currentProfileRisk);

        const [expensesResult, savingsResult, investmentsResult] =
          await Promise.all([
            fetchFinancialCategory(ENDPOINTS.EXPENSES, "expenses"),
            fetchFinancialCategory(ENDPOINTS.SAVINGS, "savings"),
            fetchFinancialCategory(ENDPOINTS.INVESTMENTS, "investments"),
          ]);
        updateFinancialData(
          {
            income: totalIncome,
            expenses: expensesResult?.total || 0,
            savings: savingsResult?.total || 0,
            investments: investmentsResult?.total || 0,
          },
          limits
        );
      } catch (error) {
        handleError(error, ERROR_MESSAGES.FETCH_INCOME);
      } finally {
        setLoading(false);
      }
    },
    [
      fetchFinancialCategory,
      calculateLimits,
      handleError,
      profileRisk,
      updateFinancialData,
    ]
  );

  // Generic data fetcher with sorting
  const getData = useCallback(async ({ path, name }) => {
    try {
      const res = await api.get(path);
      if (!res) return [];
      return [...res].sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch {
      toast.error(`Gagal memuat data ${name}`, TOAST_CONFIG);
      return [];
    }
  }, []);

  // Get detail data
  const getDetailData = useCallback(async ({ path, id, name }) => {
    try {
      const res = await api.get(`${path}/${id}`);
      return res || {};
    } catch {
      toast.error(`Gagal memuat data ${name}`, TOAST_CONFIG);
      return {};
    }
  }, []);

  // Update function
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
    } catch {
      toast.error(`${ERROR_MESSAGES.UPDATE_DATA} ${name}`, TOAST_CONFIG);
      throw new Error(ERROR_MESSAGES.UPDATE_DATA);
    }
  }, []);

  // Delete function
  const deleteData = useCallback(async ({ path, id, name }) => {
    try {
      await api.delete(`${path}/${id}`);
      toast.success("Berhasil menghapus data", TOAST_CONFIG);
      return true;
    } catch {
      toast.error(
        `${ERROR_MESSAGES.DELETE_DATA} ${name}. Mohon coba lagi`,
        TOAST_CONFIG
      );
      return false;
    }
  }, []);

  // Post functions
  const postIncome = useCallback(
    async (incomeAmount, source) => {
      const result = await apiCall(
        () =>
          api.post(ENDPOINTS.INCOME, {
            income: incomeAmount,
            source,
            date: new Date().toISOString(),
          }),
        ERROR_MESSAGES.POST_INCOME
      );
      if (result) {
        toast.success("Pemasukan berhasil ditambahkan!", TOAST_CONFIG);
        await getIncome();
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
            category,
            date: new Date().toISOString(),
          }),
        ERROR_MESSAGES.POST_EXPENSE
      );
      if (result) {
        setFinancialData(prev => ({
          ...prev,
          expenses: { ...prev.expenses, jumlah: prev.expenses.jumlah + amount },
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
            goal,
            date: new Date().toISOString(),
          }),
        ERROR_MESSAGES.POST_SAVINGS
      );
      if (result) {
        setFinancialData(prev => ({
          ...prev,
          savings: { ...prev.savings, jumlah: prev.savings.jumlah + amount },
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
            instrument,
            date: new Date().toISOString(),
          }),
        ERROR_MESSAGES.POST_INVESTMENT
      );
      if (result) {
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

  // Profile Risk
  const getProfilResiko = useCallback(
    async (forceUpdate = false) => {
      if (!forceUpdate && profileRisk && !needsUpdate.current)
        return profileRisk;
      try {
        const res = await api.get(ENDPOINTS.PROFILE_RISK);
        const response = res && res.length > 0 ? res[0] : {};
        setProfileRisk(response);
        needsUpdate.current = false;
        return response;
      } catch {
        toast.error("Gagal memuat data profile resiko", TOAST_CONFIG);
        setProfileRisk({});
        return {};
      }
    },
    [profileRisk]
  );

  const postProfileRisk = useCallback(
    async ({ name, desc, expensesLimit, savingsLimit, investmentsLimit }) => {
      try {
        const result = await api.post(ENDPOINTS.PROFILE_RISK, {
          name,
          desc,
          expensesLimit,
          savingsLimit,
          investmentsLimit,
        });
        if (result) {
          setProfileRisk(result);
          needsUpdate.current = true;
          toast.success("Berhasil membuat profile resiko", TOAST_CONFIG);
          return result;
        }
        return null;
      } catch {
        toast.error(ERROR_MESSAGES.POST_PROFILE_RISK, TOAST_CONFIG);
        throw new Error(ERROR_MESSAGES.POST_PROFILE_RISK);
      }
    },
    []
  );

  const updateProfileRisk = useCallback(
    async ({
      id,
      name,
      desc,
      expensesLimit,
      savingsLimit,
      investmentsLimit,
    }) => {
      try {
        const result = await api.put(`${ENDPOINTS.PROFILE_RISK}/${id}`, {
          name,
          desc,
          expensesLimit,
          savingsLimit,
          investmentsLimit,
        });
        if (result) {
          setProfileRisk(result);
          needsUpdate.current = true;
          toast.success("Berhasil memperbarui profil risiko", TOAST_CONFIG);
          return result;
        }
        return null;
      } catch {
        toast.error(ERROR_MESSAGES.PUT_PROFILE_RISK, TOAST_CONFIG);
        throw new Error(ERROR_MESSAGES.PUT_PROFILE_RISK);
      }
    },
    []
  );

  const refreshData = useCallback(async () => {
    if (needsUpdate.current) {
      const updatedProfileRisk = await getProfilResiko(true);
      if (updatedProfileRisk) {
        await getIncome(updatedProfileRisk);
        setDataVersion(v => v + 1);
      }
    }
  }, [getProfilResiko, getIncome]);

  // Init
  useEffect(() => {
    getProfilResiko();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (profileRisk !== null) getIncome();
    // eslint-disable-next-line
  }, [profileRisk]);

  // Result
  return {
    income: financialData.income,
    expensesState: financialData.expenses,
    savingsState: financialData.savings,
    investmentsState: financialData.investments,
    profilResiko: profileRisk,
    sisa: derivedData.sisa,
    pemakaian: derivedData.pemakaian,
    loading,
    error,
    dataVersion,
    setDataVersion,
    getIncome,
    postIncome,
    postExpense,
    postSavings,
    postInvestment,
    refreshData,
    getProfilResiko,
    postProfileRisk,
    updateProfileRisk,
    getAllFinancialData,
    getData,
    getDetailData,
    updateData,
    deleteData,
    toastConfig: TOAST_CONFIG,
  };
};
