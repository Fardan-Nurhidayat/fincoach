import { useState, useEffect } from "react";
import { api } from "@/utils/api.js";
import { toast } from "react-toastify";
import { profilResiko } from "../utils/CardDashboard.js";

export const useFinancialData = () => {
  const [income, setIncome] = useState({ jumlah: 0, sumber: "" });
  const [expensesState, setExpensesState] = useState({
    jumlah: 0,
    limit: 0,
  });
  const [savingsState, setSavingsState] = useState({
    jumlah: 0,
    limit: 0,
  });
  const [investmentsState, setInvestmentsState] = useState({
    jumlah: 0,
    limit: 0,
  });
  const [sisa, setSisa] = useState(0);
  const [pemakaian, setPemakaian] = useState(0);
  const [loading, setLoading] = useState(false);

  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const updateSisaAndPemakaian = (
    totalIncome,
    expenses,
    savings,
    investments
  ) => {
    const totalUsed = expenses + savings + investments;
    setPemakaian(totalUsed);
    setSisa(totalIncome - totalUsed);
  };
  const getAllFinancialData = async () => {
    setLoading(true);
    try {
      const [incomeRes, expensesRes, savingsRes, investmentsRes] =
        await Promise.all([
          api.get("/income"),
          api.get("/expenses"),
          api.get("/savings"),
          api.get("/investments"),
        ]);

      return {
        income: incomeRes || [],
        expenses: expensesRes || [],
        savings: savingsRes || [],
        investments: investmentsRes || [],
      };
    } catch (error) {
      console.error("Error fetching financial data:", error);
      toast.error("Gagal memuat data keuangan.", toastConfig);
      // Return empty arrays untuk mencegah error
      return {
        income: [],
        expenses: [],
        savings: [],
        investments: [],
      };
    } finally {
      setLoading(false);
    }
  };

  const getIncome = async () => {
    setLoading(true);
    try {
      const res = await api.get("/income");
      if (res) {
        const totalIncome = res.reduce((acc, item) => {
          return acc + Number(item.income);
        }, 0);
        setIncome({ jumlah: totalIncome });

        const [totalExpenses, totalSavings, totalInvestments] =
          await Promise.all([
            getExpenses(totalIncome),
            getSavings(totalIncome),
            getInvestments(totalIncome),
          ]);
        updateSisaAndPemakaian(
          totalIncome,
          totalExpenses,
          totalSavings,
          totalInvestments
        );
      }
    } catch (error) {
      console.error("Error fetching income:", error);
      toast.error("Gagal memuat data pemasukan.", toastConfig);
    } finally {
      setLoading(false);
    }
  };

  // Untuk mendapatkan jumlah dan limit pengeluaran
  const getExpenses = async totalIncome => {
    try {
      const res = await api.get("/expenses");
      if (res) {
        const totalExpenses = res.reduce((acc, item) => {
          return acc + Number(item.expenses);
        }, 0);
        setExpensesState({
          jumlah: totalExpenses,
          limit: (profilResiko.pengeluaran * totalIncome) / 100,
        });
        return totalExpenses;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Gagal memuat data pengeluaran.", toastConfig);
      return 0;
    }
  };

  // Untuk mendapatkan total dan limit tabungan
  const getSavings = async totalIncome => {
    try {
      const res = await api.get("/savings");
      if (res) {
        const totalSavings = res.reduce(
          (acc, item) => acc + Number(item.savings),
          0
        );
        setSavingsState({
          jumlah: totalSavings,
          limit: (profilResiko.tabungan * totalIncome) / 100,
        });
        return totalSavings;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching savings:", error);
      toast.error("Gagal memuat data tabungan.", toastConfig);
      return 0;
    }
  };

  // Untuk mendapatkan total dan limit investasi
  const getInvestments = async totalIncome => {
    try {
      const res = await api.get("/investments");
      if (res) {
        const totalInvestments = res.reduce(
          (acc, item) => acc + Number(item.investments),
          0
        );
        setInvestmentsState({
          jumlah: totalInvestments,
          limit: (profilResiko.investasi * totalIncome) / 100,
        });
        return totalInvestments;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching investments:", error);
      toast.error("Gagal memuat data investasi.", toastConfig);
      return 0;
    }
  };
  /* Untuk mendapatkan data dari api secara dinamis 
    Path : path untuk API
    Name : untuk nama endpoint
  */
  const getData = async ({ path, name }) => {
    try {
      const res = await api.get(path);
      const sortedByDate = [...res].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      return sortedByDate; // Kembalikan data mentah
    } catch (error) {
      toast.error(`Gagal memuat data ${name}`);
      return [];
    }
  };

  const getDetailData = async ({ path, id, name }) => {
    try {
      const res = await api.get(`${path}/${id}`);
      return res;
    } catch (error) {
      toast.error(`Gagal memuat data ${name}`);
      return [];
    }
  };

  const updateData = async ({ path, id, body, name, tipe }) => {
    try {
      const res = await api.put(`${path}/${id}`, body);
      toast.success(
        `Berhasil menambahkan ${name} dengan nilai Rp. ${body[
          tipe
        ].toLocaleString("id-ID")}`
      );
      return res;
    } catch (error) {
      toast.error(`Gagal menambahkan data ${name}`, toastConfig);
    }
  };

  const deleteData = async ({ path, id, name }) => {
    try {
      const res = await api.delete(`${path}/${id}`);
      toast.success(`Berhasil menghapus data`);
    } catch (error) {
      toast.error(`Gagal menghapus data ${name}. Mohon Coba lagi`);
    }
  };

  const postIncome = async (incomeAmount, source) => {
    try {
      const res = await api.post("/income", {
        income: incomeAmount,
        source: source,
        date: new Date().toISOString(),
      });
      if (res) {
        toast.success("Pemasukan berhasil ditambahkan!", toastConfig);
        await getIncome(); // Refresh data
        return true;
      }
    } catch (error) {
      console.error("Error posting income:", error);
      toast.error("Gagal menambahkan pemasukan.", toastConfig);
      return false;
    }
  };

  const postExpense = async (amount, category) => {
    try {
      const res = await api.post("/expenses", {
        expenses: amount,
        category: category,
        date: new Date().toISOString(),
      });
      if (res) {
        // Update local state
        setExpensesState(prev => ({
          jumlah: prev.jumlah + amount,
          limit: prev.limit,
        }));

        const newTotalUsed =
          expensesState.jumlah +
          amount +
          savingsState.jumlah +
          investmentsState.jumlah;
        setPemakaian(newTotalUsed);
        setSisa(income.jumlah - newTotalUsed);

        toast.success(
          `Pengeluaran Rp. ${amount.toLocaleString(
            "id-ID"
          )} untuk ${category} berhasil ditambahkan!`,
          toastConfig
        );
        return true;
      }
    } catch (error) {
      console.error("Error posting expense:", error);
      toast.error("Gagal menambahkan pengeluaran.", toastConfig);
      return false;
    }
  };

  const postSavings = async (amount, goal) => {
    try {
      const res = await api.post("/savings", {
        savings: amount,
        goal: goal,
        date: new Date().toISOString(),
      });
      if (res) {
        setSavingsState(prev => ({
          jumlah: prev.jumlah + amount,
          limit: prev.limit,
        }));

        const newTotalUsed =
          expensesState.jumlah +
          (savingsState.jumlah + amount) +
          investmentsState.jumlah;
        setPemakaian(newTotalUsed);
        setSisa(income.jumlah - newTotalUsed);

        toast.success(
          `Tabungan Rp. ${amount.toLocaleString(
            "id-ID"
          )} untuk ${goal} berhasil ditambahkan!`,
          toastConfig
        );
        return true;
      }
    } catch (error) {
      console.error("Error posting savings:", error);
      toast.error("Gagal menambahkan tabungan.", toastConfig);
      return false;
    }
  };

  const postInvestment = async (amount, instrument) => {
    try {
      const res = await api.post("/investments", {
        investments: amount,
        instrument: instrument,
        date: new Date().toISOString(),
      });
      if (res) {
        setInvestmentsState(prev => ({
          jumlah: prev.jumlah + amount,
          limit: prev.limit,
        }));

        const newTotalUsed =
          expensesState.jumlah +
          savingsState.jumlah +
          (investmentsState.jumlah + amount);
        setPemakaian(newTotalUsed);
        setSisa(income.jumlah - newTotalUsed);

        toast.success(
          `Investasi Rp. ${amount.toLocaleString(
            "id-ID"
          )} pada ${instrument} berhasil ditambahkan!`,
          toastConfig
        );
        return true;
      }
    } catch (error) {
      console.error("Error posting investment:", error);
      toast.error("Gagal menambahkan investasi.", toastConfig);
      return false;
    }
  };

  const refreshData = () => {
    getIncome();
  };

  useEffect(() => {
    getIncome();
  }, []);

  return {
    // State
    income,
    expensesState,
    savingsState,
    investmentsState,
    sisa,
    pemakaian,
    loading,

    // Actions
    postIncome,
    postExpense,
    postSavings,
    postInvestment,
    refreshData,

    // Config
    toastConfig,
    getAllFinancialData,
    getData,
    getDetailData,
    updateData,
    deleteData,
  };
};
