import { useState, useEffect, useCallback, useMemo } from "react";
import TabunganLayout from "@/view/components/tabungan-layout";
import Header from "../template/HeaderForFinance";
import ChartTemplate from "../template/ChartForFinance";
import CardAndModalTemplate from "../template/CardForFinance";
import TableTemplate from "../template/TableForFinance";
import { useFinancialData } from "@/hooks/useFinancialData";
import { toast, ToastContainer } from "react-toastify";

// Form Fields
const FORM_FIELDS = [
  {
    label: "Jumlah",
    id: "tabungan",
    placeholder: "Masukkan Jumlah",
  },
  {
    label: "Tujuan",
    id: "tujuan",
    placeholder: "Contoh: Liburan, DP Rumah, dll",
  },
];

// Chart Config
const CHART_CONFIG = {
  label: "Tabungan",
  color: "#22c55e",
};

// Utility Functions
const groupSavingsByDate = data => {
  const savingsByDate = new Map();

  data.forEach(item => {
    const dateOnly = new Date(item.date).toISOString().split("T")[0];
    const currentTotal = savingsByDate.get(dateOnly) || 0;
    savingsByDate.set(dateOnly, currentTotal + item.savings);
  });

  return Array.from(savingsByDate.entries()).map(([date, savings]) => ({
    date,
    savings,
  }));
};

const calculateTotal = data => {
  return data.reduce((acc, item) => acc + item.savings, 0);
};

export default function Tabungan() {
  const {
    getData,
    getDetailData,
    savingsState,
    postSavings,
    updateData,
    deleteData,
    loading: globalLoading,
    error: globalError,
  } = useFinancialData();

  const [tabunganData, setTabunganData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized calculations
  const totalTabungan = useMemo(
    () => calculateTotal(tabunganData),
    [tabunganData]
  );
  const sumTabunganData = useMemo(
    () => groupSavingsByDate(tabunganData),
    [tabunganData]
  );

  // Fetch Savings Data
  const fetchTabungan = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getData({
        path: "/savings",
        name: "tabungan",
      });
      setTabunganData(data || []);
    } catch (error) {
      console.error("Error fetching savings:", error);
      toast.error("Gagal memuat data tabungan");
    } finally {
      setIsLoading(false);
    }
  }, [getData]);

  // Validate Form
  const validateForm = useCallback(
    async (amount, tujuan, past) => {
      // 1. Validasi input wajib terlebih dahulu
      if (!amount || !tujuan) {
        toast.error("Jumlah dan tujuan harus diisi");
        return false;
      }

      // 2. Konversi ke number dan validasi
      const currentAmount = Number(amount);
      const pastAmount = Number(past) || 0;

      if (isNaN(currentAmount) || currentAmount <= 0) {
        toast.error("Jumlah harus berupa angka yang valid dan lebih dari 0");
        return false;
      }

      // 3. Hitung selisih dengan logika yang lebih jelas
      const difference = currentAmount - pastAmount;

      try {
        // 4. Tunggu totalTabungan dan hitung total baru
        const currentTotal = totalTabungan;
        const newTotal = currentTotal + difference;

        // 5. Validasi terhadap limit
        if (newTotal > savingsState.limit) {
          toast.error(
            `Total tabungan akan melebihi batas bulanan (${savingsState.limit.toLocaleString()})`
          );
          return false;
        }

        // 6. Validasi individual amount terhadap limit (optional)
        if (currentAmount > savingsState.limit) {
          toast.error(
            `Jumlah tabungan tidak boleh melebihi batas bulanan (${savingsState.limit.toLocaleString()})`
          );
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error validating form:", error);
        toast.error("Terjadi kesalahan saat validasi");
        return false;
      }
    },
    [savingsState.limit, totalTabungan]
  );

  // Submit Handler
  const submitHandler = useCallback(
    async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const amount = parseInt(formData.get("tabungan"), 10);
      const goal = formData.get("tujuan");

      if (!validateForm(amount, goal)) {
        return;
      }

      try {
        const success = await postSavings(amount, goal);
        if (success) {
          const newSaving = {
            id: Date.now(),
            savings: amount,
            goal: goal,
            date: new Date().toISOString(),
          };
          console.log(e.target);

          setTabunganData(prev => [...prev, newSaving]);
          e.target.reset();
          fetchTabungan();
        }
      } catch (error) {
        console.error("Error adding saving:", error);
      }
    },
    [postSavings, validateForm, fetchTabungan]
  );

  // Update Handler
  const updateHandler = useCallback(
    async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get("id");
      const pastValue = formData.get("past");
      const savings = parseInt(formData.get("savings"), 10);
      const goal = formData.get("goal");

      const isValid = await validateForm(savings, goal, pastValue);
      if (!isValid) return;

      try {
        const newData = { savings, goal };
        await updateData({
          path: "/savings",
          id: id,
          body: newData,
          name: "tabungan",
          tipe: "savings",
        });

        setTabunganData(prev =>
          prev.map(item =>
            item.id === parseInt(id) ? { ...item, savings, goal } : item
          )
        );

        fetchTabungan();
      } catch (error) {
        console.error("Error updating saving:", error);
      }
    },
    [validateForm]
  );

  // Delete Handler
  const handleDelete = useCallback(
    async id => {
      try {
        const success = await deleteData({
          path: "/savings",
          id: id,
          name: "tabungan",
        });

        if (success) {
          setTabunganData(prev => prev.filter(item => item.id !== id));
          fetchTabungan();
        }
      } catch (error) {
        console.error("Error deleting saving:", error);
      }
    },
    [deleteData, fetchTabungan]
  );

  // Initialize
  useEffect(() => {
    fetchTabungan();
  }, [fetchTabungan]);

  // Loading UI
  if (isLoading || globalLoading) {
    return (
      <TabunganLayout>
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-center h-64'>
              <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
            </div>
          </div>
        </div>
      </TabunganLayout>
    );
  }

  // Error UI
  if (globalError) {
    return (
      <TabunganLayout>
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-center'>
              <p className='text-red-800'>Terjadi kesalahan saat memuat data</p>
              <button
                onClick={fetchTabungan}
                className='mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </TabunganLayout>
    );
  }

  return (
    <TabunganLayout>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <Header
            title='Tabungan'
            description='Rencanakan masa depanmu!'
          />

          {/* Card & Modal */}
          <CardAndModalTemplate
            title='Tabungan'
            currentTotal={totalTabungan}
            limit={savingsState.limit}
            jenis='tabungan'
            triggerText='Tambah Tabungan'
            formFields={FORM_FIELDS}
            onSubmit={submitHandler}
          />

          {/* Chart Section */}
          <div className='bg-white rounded-2xl mt-5 shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 transition-all hover:shadow-2xl'>
            <h3 className='text-xl font-semibold text-gray-700 mb-6'>
              Histori Tabungan
            </h3>
            <ChartTemplate
              titleChart='Tabungan'
              descriptionChart='Histori Tabungan Anda'
              dataChartRaw={sumTabunganData}
              configChart={CHART_CONFIG}
              valueKey='savings'
            />
          </div>

          {/* Table Section */}
          <TableTemplate
            data={tabunganData}
            jenis='savings'
            submitHandler={updateHandler}
            getDetailData={getDetailData}
            deleteHandler={handleDelete}
          />
        </div>
      </div>
      <ToastContainer />
    </TabunganLayout>
  );
}
