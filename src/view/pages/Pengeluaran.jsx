import { useState, useEffect, useCallback, useMemo } from "react";
import PengeluaranLayout from "@/view/components/Pengeluaran/pengeluaran-layout";
import Header from "../template/HeaderForFinance";
import ChartTemplate from "../template/ChartForFinance";
import CardAndModalTemplate from "../template/CardForFinance";
import TableTemplate from "../template/TableForFinance";
import { useFinancialData } from "@/hooks/useFinancialData";
import { toast, ToastContainer } from "react-toastify";

// Constants
const FORM_FIELDS = [
  {
    label: "Jumlah",
    id: "pengeluaran",
    placeholder: "Masukan Jumlah",
  },
  {
    label: "Kategori",
    id: "kategori",
    placeholder: "Makanan, Tagihan , dll",
  },
];

const CHART_CONFIG = {
  label: "Pengeluaran",
  color: "#dc2626",
};

// Utility functions
const groupExpensesByDate = data => {
  const expensesByDate = new Map();

  data.forEach(item => {
    const dateOnly = new Date(item.date).toISOString().split("T")[0];
    const currentTotal = expensesByDate.get(dateOnly) || 0;
    expensesByDate.set(dateOnly, currentTotal + item.expenses);
  });

  return Array.from(expensesByDate.entries()).map(([date, expenses]) => ({
    date,
    expenses,
  }));
};

const calculateTotal = data => {
  return data.reduce((acc, item) => acc + item.expenses, 0);
};

export default function Pengeluaran() {
  // Use the improved hook
  const {
    getData,
    getDetailData,
    expensesState,
    postExpense,
    updateData,
    deleteData,
    loading: globalLoading,
    error: globalError,
  } = useFinancialData();

  // Local state
  const [pengeluaranData, setPengeluaranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized calculations
  const totalPengeluaran = useMemo(
    () => calculateTotal(pengeluaranData),
    [pengeluaranData]
  );

  const sumPengeluaranData = useMemo(
    () => groupExpensesByDate(pengeluaranData),
    [pengeluaranData]
  );

  // Fetch expenses data
  const fetchPengeluaran = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getData({
        path: "/expenses",
        name: "pengeluaran",
      });
      setPengeluaranData(data || []);
    } catch (error) {
      console.error("Error fetching pengeluaran:", error);
      toast.error("Gagal memuat data pengeluaran");
    } finally {
      setIsLoading(false);
    }
  }, [getData]);

  // Form validation
  const validateForm = useCallback(
    (amount, desc) => {
      if (!amount || !desc) {
        toast.error("Jumlah dan Kategori harus diisi");
        return false;
      }

      if (
        expensesState.limit < amount ||
        expensesState.jumlah + amount > expensesState.limit
      ) {
        toast.error("Jumlah Pengeluaran melebihi limit");
        return false;
      }

      return true;
    },
    [expensesState.limit, expensesState.jumlah]
  );

  // Submit handler for adding new expense
  const submitHandler = useCallback(
    async e => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const amount = parseInt(formData.get("pengeluaran"), 10);
      const desc = formData.get("kategori");

      if (!validateForm(amount, desc)) {
        return;
      }

      try {
        const success = await postExpense(amount, desc);
        if (success) {
          // Optimistic update - add to local state immediately
          const newExpense = {
            id: Date.now(), // Temporary ID until refresh
            expenses: amount,
            category: desc,
            date: new Date().toISOString(),
          };

          setPengeluaranData(prev => [...prev, newExpense]);
          e.target.reset();

          // Refresh data to get actual server data
          fetchPengeluaran();
        }
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    },
    [postExpense, validateForm, fetchPengeluaran]
  );

  // Update handler
  const updateHandler = useCallback(
    async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get("idPengeluaran");
      const expenses = parseInt(formData.get("expenses"), 10);
      const category = formData.get("category");

      if (!validateForm(expenses, category)) {
        return;
      }

      try {
        const newData = { expenses, category };
        await updateData({
          path: "/expenses",
          id: id,
          body: newData,
          name: "pengeluaran",
          tipe: "expenses",
        });

        // Optimistic update
        setPengeluaranData(prev =>
          prev.map(item =>
            item.id === parseInt(id) ? { ...item, expenses, category } : item
          )
        );

        // Refresh to ensure data consistency
        fetchPengeluaran();
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    },
    [updateData, fetchPengeluaran]
  );

  // Delete handler
  const handleDelete = useCallback(
    async id => {
      try {
        const success = await deleteData({
          path: "/expenses",
          id: id,
          name: "pengeluaran",
        });

        if (success) {
          // Optimistic update
          setPengeluaranData(prev => prev.filter(item => item.id !== id));

          // Refresh to ensure data consistency
          fetchPengeluaran();
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    },
    [deleteData, fetchPengeluaran]
  );

  // Initialize data on mount
  useEffect(() => {
    fetchPengeluaran();
  }, [fetchPengeluaran]);

  // Show loading state
  if (isLoading || globalLoading) {
    return (
      <PengeluaranLayout>
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-center h-64'>
              <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
            </div>
          </div>
        </div>
      </PengeluaranLayout>
    );
  }

  // Show error state
  if (globalError) {
    return (
      <PengeluaranLayout>
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-center'>
              <p className='text-red-800'>Terjadi kesalahan saat memuat data</p>
              <button
                onClick={fetchPengeluaran}
                className='mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </PengeluaranLayout>
    );
  }

  return (
    <PengeluaranLayout>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Header Section */}
          <Header
            title='Pengeluaran'
            description='Pengeluaran Anda'
          />

          {/* Card and Modal Section */}
          <CardAndModalTemplate
            title='Pengeluaran'
            currentTotal={totalPengeluaran}
            limit={expensesState.limit}
            jenis='pengeluaran'
            triggerText='Tambah Pengeluaran'
            formFields={FORM_FIELDS}
            onSubmit={submitHandler}
          />

          {/* Chart Section */}
          <div className='bg-white rounded-2xl mt-5 shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 transition-all hover:shadow-2xl'>
            <h3 className='text-xl font-semibold text-gray-700 mb-6'>
              Histori Pengeluaran
            </h3>
            <ChartTemplate
              titleChart='Pengeluaran'
              descriptionChart='Histori Pengeluaran Anda'
              dataChartRaw={sumPengeluaranData}
              configChart={CHART_CONFIG}
              valueKey='expenses'
            />
          </div>

          {/* Table Section */}
          <TableTemplate
            data={pengeluaranData}
            jenis='expenses'
            submitHandler={updateHandler}
            getDetailData={getDetailData}
            deleteHandler={handleDelete}
          />
        </div>
      </div>
      <ToastContainer />
    </PengeluaranLayout>
  );
}
