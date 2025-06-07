import { useState, useEffect } from "react";
import PengeluaranLayout from "@/view/components/Pengeluaran/pengeluaran-layout";
import Header from "../template/HeaderForFinance";
import ChartTemplate from "../template/ChartForFinance";
import CardAndModalTemplate from "../template/CardForFinance";
import TableTemplate from "../template/TableForFinance";
import { useFinancialData } from "@/hooks/useFinancialData";
import { toast, ToastContainer } from "react-toastify";

export default function Pengeluaran() {
  const {
    getData,
    getDetailData,
    expensesState,
    postExpense,
    updateData,
    deleteData,
    toastConfig,
  } = useFinancialData();
  const [pengeluaranData, setPengeluaranData] = useState([]);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [sumPengeluaranDaa, setSumPengeluaranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchPengeluaran = async () => {
    setIsLoading(true);
    const data = await getData({
      path: "/expenses",
      name: "pengeluaran",
    });
    const total = data.reduce((acc, item) => acc + item.expenses, 0);

    const expensesByDate = new Map();

    data.forEach(item => {
      const dateOnly = new Date(item.date).toISOString().split("T")[0];
      const currentTotal = expensesByDate.get(dateOnly) || 0;
      expensesByDate.set(dateOnly, currentTotal + item.expenses);
    });

    // Konversi ke array
    const groupedData = Array.from(expensesByDate.entries()).map(
      ([date, expenses]) => ({ date, expenses })
    );
    setSumPengeluaranData(groupedData);
    setTotalPengeluaran(total);
    setPengeluaranData(data);
    setIsLoading(false);
  };
  const submitHandler = async e => {
    e.preventDefault();
    const amount = parseInt(e.target.pengeluaran.value, 10);
    const desc = e.target.kategori.value;
    if (!amount || !desc) {
      toast.error("Jumlah  dan Kategori harus diisi", toastConfig);
      return;
    } else if (
      expensesState.limit < amount ||
      expensesState.jumlah + amount > expensesState.limit
    ) {
      toast.error("Jumlah Pengeluaran melebihi limit", toastConfig);
      return;
    }
    await postExpense(amount, desc);
    fetchPengeluaran();
    e.target.reset();
  };
  const updateHandler = async e => {
    e.preventDefault();
    const id = e.target.idPengeluaran.value;
    const expenses = parseInt(e.target.expenses.value, 10);
    const category = e.target.category.value;

    const newData = { expenses, category };

    await updateData({
      path: "/expenses",
      id: id,
      body: newData,
      name: "pengeluaran",
      tipe: "expenses",
    });

    // Update data lokal tanpa API call
    // const updatedData = pengeluaranData.map(item =>
    //   item.id === id ? { ...item, expenses, category } : item
    // );

    // Update grouped data
    // const expensesByDate = new Map();
    // updatedData.forEach(item => {
    //   const dateOnly = new Date(item.date).toISOString().split("T")[0];
    //   const currentTotal = expensesByDate.get(dateOnly) || 0;
    //   expensesByDate.set(dateOnly, currentTotal + item.expenses);
    // });

    // const newGroupedData = Array.from(expensesByDate.entries()).map(
    //   ([date, expenses]) => ({ date, expenses })
    // );

    // setPengeluaranData(updatedData);
    // setSumPengeluaranData(newGroupedData);
    fetchPengeluaran();
  };

  const handleDelete = async id => {
    try {
      const response = await deleteData({
        path: "/expenses",
        id: id,
        name: "pengeluaran",
      });
      setPengeluaranData(prev => prev.filter(item => item.id !== id));
      fetchPengeluaran(); // Sinkronkan dengan server jika diperlukan
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      toast.error("Gagal menghapus data. Mohon coba lagi.");
    }
  };

  useEffect(() => {
    fetchPengeluaran();
  }, []);

  return (
    <PengeluaranLayout>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Header Section */}
          <Header
            title={"Pengeluaran"}
            description={"Pengeluaran Anda"}></Header>
          <CardAndModalTemplate
            title={"Pengeluaran"}
            currentTotal={totalPengeluaran}
            limit={expensesState.limit}
            jenis={"pengeluaran"}
            triggerText={"Tambah Pengeluaran"}
            formFields={[
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
            ]}
            onSubmit={submitHandler}></CardAndModalTemplate>

          {/* Chart Section */}
          <div className='bg-white rounded-2xl mt-5 shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 transition-all hover:shadow-2xl'>
            <h3 className='text-xl font-semibold text-gray-700 mb-6'>
              Histori Pengeluaran
            </h3>
            <ChartTemplate
              titleChart='Pengeluaran'
              descriptionChart='Histori Pengeluaran Anda'
              dataChartRaw={sumPengeluaranDaa}
              configChart={{
                label: "Pengeluaran",
                color: "#dc2626",
              }}
              valueKey='expenses'
            />
          </div>

          {/* Table */}
          <TableTemplate
            data={pengeluaranData}
            jenis={"expenses"}
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
