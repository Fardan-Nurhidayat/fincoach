import { useState, useEffect, useCallback, useMemo } from "react";
import PemasukanLayout from "../components/pemasukan-layout";
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
    id: "jumlah",
    placeholder: "Masukkan jumlah pemasukan",
  },
  {
    label: "Sumber",
    id: "sumber",
    placeholder: "Contoh: Gaji, Freelance, Bonus",
  },
];

// Chart Config
const CHART_CONFIG = {
  label: "Pemasukan",
  color: "#3b82f6",
};

// Utility Functions
const groupIncomeByDate = (data) => {
  const incomeByDate = new Map();

  data.forEach((item) => {
    const dateOnly = new Date(item.date).toISOString().split("T")[0];
    const currentTotal = incomeByDate.get(dateOnly) || 0;
    incomeByDate.set(dateOnly, currentTotal + Number(item.income)); // Selalu jadikan number
  });

  return Array.from(incomeByDate.entries()).map(([date, income]) => ({
    date,
    income,
  }));
};

const calculateTotal = (data) => {
  return data.reduce((acc, item) => acc + Number(item.income), 0); // Pastikan selalu number
};

export default function Pemasukan() {
  const {
    getData,
    getDetailData,
    income,
    postIncome,
    updateData,
    deleteData,
    loading: globalLoading,
    error: globalError,
  } = useFinancialData();

  const [pemasukanData, setPemasukanData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized calculations
  const totalPemasukan = useMemo(
    () => calculateTotal(pemasukanData),
    [pemasukanData]
  );

  const sumPemasukanData = useMemo(
    () => groupIncomeByDate(pemasukanData),
    [pemasukanData]
  );

  // Fetch Income Data
  const fetchPemasukan = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getData({
        path: "/income",
        name: "pemasukan",
      });

      // Pastikan income dikonversi ke number
      const parsedData = Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            income: Number(item.income),
          }))
        : [];

      setPemasukanData(parsedData);
    } catch (error) {
      console.error("Error fetching income:", error);
      toast.error("Gagal memuat data pemasukan");
    } finally {
      setIsLoading(false);
    }
  }, [getData]);

  // Validate Form
  const validateForm = useCallback(async (amount, sumber, past) => {
    if (!amount || !sumber) {
      toast.error("Jumlah dan sumber harus diisi");
      return false;
    }

    const currentAmount = Number(amount);
    // const pastAmount = Number(past);

    if (isNaN(currentAmount) || currentAmount <= 0) {
      toast.error("Jumlah harus berupa angka yang valid dan lebih dari 0");
      return false;
    }

    return true;
  }, []);

  // Submit Handler
  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const amount = parseInt(formData.get("jumlah"), 10);
      const source = formData.get("sumber");

      if (!validateForm(amount, source)) return;

      try {
        const success = await postIncome(amount, source);
        if (success) {
          const newIncome = {
            id: Date.now(),
            income: amount,
            source: source,
            date: new Date().toISOString(),
          };
          setPemasukanData((prev) => [...prev, newIncome]);
          e.target.reset();
          fetchPemasukan();
        }
      } catch (error) {
        console.error("Error adding income:", error);
        toast.error("Gagal menambahkan pemasukan");
      }
    },
    [postIncome, validateForm, fetchPemasukan]
  );

  // Update Handler
  const updateHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get("id");
      const pastValue = formData.get("past");
      const income = parseInt(formData.get("income"), 10);
      const source = formData.get("source");

      const isValid = await validateForm(income, source, pastValue);
      if (!isValid) return;

      try {
        const newData = { income, source };
        await updateData({
          path: "/income",
          id: id,
          body: newData,
          name: "pemasukan",
          tipe: "income",
        });

        setPemasukanData((prev) =>
          prev.map((item) =>
            item.id === parseInt(id) ? { ...item, income, source } : item
          )
        );

        fetchPemasukan();
      } catch (error) {
        console.error("Error updating income:", error);
        toast.error("Gagal memperbarui pemasukan");
      }
    },
    [validateForm]
  );

  // Delete Handler
  const handleDelete = useCallback(
    async (id) => {
      try {
        const success = await deleteData({
          path: "/income",
          id: id,
          name: "pemasukan",
        });

        if (success) {
          setPemasukanData((prev) => prev.filter((item) => item.id !== id));
          fetchPemasukan();
        }
      } catch (error) {
        console.error("Error deleting income:", error);
        toast.error("Gagal menghapus pemasukan");
      }
    },
    [deleteData, fetchPemasukan]
  );

  // Initialize
  useEffect(() => {
    fetchPemasukan();
  }, [fetchPemasukan]);

  // Loading UI
  if (isLoading || globalLoading) {
    return (
      <PemasukanLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </PemasukanLayout>
    );
  }

  // Error UI
  if (globalError) {
    return (
      <PemasukanLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800">Terjadi kesalahan saat memuat data</p>
              <button
                onClick={fetchPemasukan}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </PemasukanLayout>
    );
  }

  return (
    <PemasukanLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Header title="Pemasukan" description="Catat Pemasukan Anda!" />

          {/* Card & Modal */}
          <CardAndModalTemplate
            title="Pemasukan"
            currentTotal={totalPemasukan}
            limit={income.limit ?? 0}
            jenis="pemasukan"
            triggerText="Tambah Pemasukan"
            formFields={FORM_FIELDS}
            onSubmit={submitHandler}
          />

          {/* Chart Section */}
          <div className="bg-white rounded-2xl mt-5 shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 transition-all hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              Histori Pemasukan
            </h3>
            <ChartTemplate
              titleChart="Pemasukan"
              descriptionChart="Histori Pemasukan Anda"
              dataChartRaw={sumPemasukanData}
              configChart={CHART_CONFIG}
              valueKey="income"
            />
          </div>

          {/* Table Section */}
          <TableTemplate
            data={pemasukanData}
            jenis="income"
            submitHandler={updateHandler}
            getDetailData={getDetailData}
            deleteHandler={handleDelete}
          />
        </div>
      </div>
      <ToastContainer />
    </PemasukanLayout>
  );
}
