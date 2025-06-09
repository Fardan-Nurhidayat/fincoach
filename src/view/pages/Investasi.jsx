import { useState, useEffect, useCallback, useMemo } from "react";
import InvestasiLayout from "@/view/components/investasi-layout";
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
    id: "investasi",
    placeholder: "Masukkan Jumlah",
  },
  {
    label: "instrumen",
    id: "instrumen",
    placeholder: "Contoh: Saham , Obligasi , dll",
  },
];

// Chart Config
const CHART_CONFIG = {
  label: "investasi",
  color: "#4CAF50",
};

// Utility Functions
const groupinvestmentByDate = data => {
  const investmentByDate = new Map();

  data.forEach((item) => {
    const dateOnly = new Date(item.date).toISOString().split("T")[0];
    const currentTotal = investmentByDate.get(dateOnly) || 0;
    investmentByDate.set(dateOnly, currentTotal + (item.investments));
  });

  return Array.from(investmentByDate.entries()).map(([date, investments]) => ({
    date,
    investments,
  }));
};

const calculateTotal = (data) => {
  return data.reduce((acc, item) => {
    const value = Number(item.investments);
    return isNaN(value) ? acc : acc + value;
  }, 0);
};

export default function Investasi() {
  const {
    getData,
    getDetailData,
    investmentsState,
    postInvestment,
    updateData,
    deleteData,
    loading: globalLoading,
    error: globalError,
  } = useFinancialData();

  const [investasiData, setInvestasiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized calculations
  const totalInvestasi = useMemo(
    () => calculateTotal(investasiData),
    [investasiData]
  );
  const sumInvestasiData = useMemo(
    () => groupinvestmentByDate(investasiData),
    [investasiData]
  );

  // Fetch investment Data
  const fetchInvestasi = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getData({
        path: "/investments",
        name: "investasi",
      });
      setInvestasiData(data || []);
    } catch (error) {
      console.error("Error fetching investment:", error);
      toast.error("Gagal memuat data investasi");
    } finally {
      setIsLoading(false);
    }
  }, [getData]);

  // Validate Form
  const validateForm = useCallback(
    async (amount, instrumen, past) => {
      // 1. Validasi input wajib terlebih dahulu
      if (!amount || !instrumen) {
        toast.error("Jumlah dan instrumen harus diisi");
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
        // 4. Tunggu totalInvestasi dan hitung total baru
        const currentTotal = totalInvestasi;
        const newTotal = currentTotal + difference;

        // 5. Validasi terhadap limit
        if (newTotal > investmentsState.limit) {
          toast.error(
            `Total investasi akan melebihi batas bulanan (${investmentsState.limit.toLocaleString()})`
          );
          return false;
        }

        // 6. Validasi individual amount terhadap limit (optional)
        if (currentAmount > investmentsState.limit) {
          toast.error(
            `Jumlah investasi tidak boleh melebihi batas bulanan (${investmentsState.limit.toLocaleString()})`
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
    [investmentsState.limit, totalInvestasi]
  );

  // Submit Handler
  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const amount = parseInt(formData.get("investasi"), 10);
      const instrument = formData.get("instrumen");

      if (!validateForm(amount, instrument)) {
        return;
      }

      try {
        const success = await postInvestment(amount, instrument);
        if (success) {
          const newInvestment = {
            id: Date.now(),
            investments: amount,
            instrument: instrument,
            date: new Date().toISOString(),
          };

          setInvestasiData((prev) => [...prev, newInvestment]);
          e.target.reset();
          fetchInvestasi();
        }
      } catch (error) {
        console.error("Error adding investment:", error);
      }
    },
    [postInvestment, validateForm, fetchInvestasi]
  );

  // Update Handler
  const updateHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get("id");
      const pastValue = formData.get("past");
      const investments = parseInt(formData.get("investments"), 10);
      const instrument = formData.get("instrument");

      const isValid = await validateForm(investments, instrument, pastValue);
      if (!isValid) return;

      try {
        const newData = { investments, instrument };
        await updateData({
          path: "/investments",
          id: id,
          body: newData,
          name: "investasi",
          tipe: "investments",
        });

        setInvestasiData((prev) =>
          prev.map((item) =>
            item.id === parseInt(id) ? { ...item, investments, instrument } : item
          )
        );

        fetchInvestasi();
      } catch (error) {
        console.error("Error updating investment:", error);
      }
    },
    [validateForm]
  );

  // Delete Handler
  const handleDelete = useCallback(
    async (id) => {
      try {
        const success = await deleteData({
          path: "/investments",
          id: id,
          name: "investasi",
        });

        if (success) {
          setInvestasiData((prev) => prev.filter((item) => item.id !== id));
          fetchInvestasi();
        }
      } catch (error) {
        console.error("Error deleting investment:", error);
      }
    },
    [deleteData, fetchInvestasi]
  );

  // Initialize
  useEffect(() => {
    fetchInvestasi();
  }, [fetchInvestasi]);

  // Loading UI
  if (isLoading || globalLoading) {
    return (
      <InvestasiLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </InvestasiLayout>
    );
  }

  // Error UI
  if (globalError) {
    return (
      <InvestasiLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800">Terjadi kesalahan saat memuat data</p>
              <button
                onClick={fetchInvestasi}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </InvestasiLayout>
    );
  }

  return (
    <InvestasiLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Header title="investasi" description="Rencanakan masa depanmu!" />

          {/* Card & Modal */}
          <CardAndModalTemplate
            title="investasi"
            currentTotal={totalInvestasi}
            limit={investmentsState.limit}
            jenis="investasi"
            triggerText="Tambah investasi"
            formFields={FORM_FIELDS}
            onSubmit={submitHandler}
          />

          {/* Chart Section */}
          <div className="bg-white rounded-2xl mt-5 shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 transition-all hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              Histori investasi
            </h3>
            <ChartTemplate
              titleChart="investasi"
              descriptionChart="Histori investasi Anda"
              dataChartRaw={sumInvestasiData}
              configChart={CHART_CONFIG}
              valueKey="investments"
            />
          </div>

          {/* Table Section */}
          <TableTemplate
            data={investasiData}
            jenis="investments"
            submitHandler={updateHandler}
            getDetailData={getDetailData}
            deleteHandler={handleDelete}
          />
        </div>
      </div>
      <ToastContainer />
    </InvestasiLayout>
  );
}
