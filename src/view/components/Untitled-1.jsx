import { useState, useEffect, useMemo } from "react";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useIsMobile } from "@/hooks/use-mobile";

const createCurrentFinancialData = apiResponse => {
  if (!apiResponse) return [];

  const {
    income = [],
    expenses = [],
    savings = [],
    investments = [],
  } = apiResponse;

  // Hitung total untuk setiap kategori
  const totalIncome = income.reduce(
    (acc, item) => acc + Number(item.income || 0),
    0
  );
  const totalExpenses = expenses.reduce(
    (acc, item) => acc + Number(item.expenses || 0),
    0
  );
  const totalSavings = savings.reduce(
    (acc, item) => acc + Number(item.savings || 0),
    0
  );
  const totalInvestments = investments.reduce(
    (acc, item) => acc + Number(item.investments || 0),
    0
  );

  const today = new Date().toISOString().split("T")[0];

  return [
    {
      date: today,
      pemasukan: totalIncome,
      pengeluaran: totalExpenses,
      tabungan: totalSavings,
      investasi: totalInvestments,
    },
  ];
};

// Fungsi untuk generate chart data berdasarkan data historis
const generateChartDataFromAPI = (apiResponse, timeRange = "30d") => {
  if (!apiResponse) return [];

  const {
    income = [],
    expenses = [],
    savings = [],
    investments = [],
  } = apiResponse;

  // Tentukan range tanggal
  let daysBack = 30;
  if (timeRange === "7d") daysBack = 7;
  else if (timeRange === "90d") daysBack = 90;

  const endDate = new Date();
  const startDate = new Date(
    endDate.getTime() - daysBack * 24 * 60 * 60 * 1000
  );

  // Fungsi helper untuk filter data berdasarkan tanggal
  const filterByDateRange = dataArray => {
    return dataArray.filter(item => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Filter data berdasarkan range tanggal
  const filteredIncome = filterByDateRange(income);
  const filteredExpenses = filterByDateRange(expenses);
  const filteredSavings = filterByDateRange(savings);
  const filteredInvestments = filterByDateRange(investments);

  // Group data by date
  const groupedData = {};

  // Helper function untuk menambah data ke group
  const addToGroup = (item, key, value) => {
    const date = new Date(item.date).toISOString().split("T")[0];
    if (!groupedData[date]) {
      groupedData[date] = {
        date,
        pemasukan: 0,
        pengeluaran: 0,
        tabungan: 0,
        investasi: 0,
      };
    }
    groupedData[date][key] += Number(value || 0);
  };

  // Process each category
  filteredIncome.forEach(item => addToGroup(item, "pemasukan", item.income));
  filteredExpenses.forEach(item =>
    addToGroup(item, "pengeluaran", item.expenses)
  );
  filteredSavings.forEach(item => addToGroup(item, "tabungan", item.savings));
  filteredInvestments.forEach(item =>
    addToGroup(item, "investasi", item.investments)
  );

  // Convert to array dan sort by date
  const chartData = Object.values(groupedData).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Jika tidak ada data, buat data kosong untuk range tanggal
  if (chartData.length === 0) {
    const emptyData = [];
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
      emptyData.unshift({
        date: date.toISOString().split("T")[0],
        pemasukan: 0,
        pengeluaran: 0,
        tabungan: 0,
        investasi: 0,
      });
    }
    return emptyData;
  }

  return chartData;
};

// Fungsi untuk mengupdate getAllFinancialData
// const getAllFinancialData = async () => {
//   setLoading(true);
//   try {
//     const [incomeRes, expensesRes, savingsRes, investmentsRes] =
//       await Promise.all([
//         api.get("/income"),
//         api.get("/expenses"),
//         api.get("/savings"),
//         api.get("/investments"),
//       ]);

//     const apiResponse = {
//       income: incomeRes || [],
//       expenses: expensesRes || [],
//       savings: savingsRes || [],
//       investments: investmentsRes || [],
//     };

//     // Hitung totals
//     const totalIncome = apiResponse.income.reduce(
//       (acc, item) => acc + Number(item.income || 0),
//       0
//     );
//     const totalExpenses = apiResponse.expenses.reduce(
//       (acc, item) => acc + Number(item.expenses || 0),
//       0
//     );
//     const totalSavings = apiResponse.savings.reduce(
//       (acc, item) => acc + Number(item.savings || 0),
//       0
//     );
//     const totalInvestments = apiResponse.investments.reduce(
//       (acc, item) => acc + Number(item.investments || 0),
//       0
//     );

//     // Update states
//     setIncome({ jumlah: totalIncome });
//     setExpensesState({
//       jumlah: totalExpenses,
//       limit: (profilResiko.pengeluaran * totalIncome) / 100,
//     });
//     setSavingsState({
//       jumlah: totalSavings,
//       limit: (profilResiko.tabungan * totalIncome) / 100,
//     });
//     setInvestmentsState({
//       jumlah: totalInvestments,
//       limit: (profilResiko.investasi * totalIncome) / 100,
//     });

//     // Update sisa dan pemakaian
//     const totalUsed = totalExpenses + totalSavings + totalInvestments;
//     setPemakaian(totalUsed);
//     setSisa(totalIncome - totalUsed);

//     return apiResponse;
//   } catch (error) {
//     console.error("Error fetching financial data:", error);
//     toast.error("Gagal memuat data keuangan.", toastConfig);
//     return {
//       income: [],
//       expenses: [],
//       savings: [],
//       investments: [],
//     };
//   } finally {
//     setLoading(false);
//   }
// };

// Fungsi untuk mendapatkan summary data
const getFinancialSummary = apiResponse => {
  if (!apiResponse) return null;

  const {
    income = [],
    expenses = [],
    savings = [],
    investments = [],
  } = apiResponse;

  const totalIncome = income.reduce(
    (acc, item) => acc + Number(item.income || 0),
    0
  );
  const totalExpenses = expenses.reduce(
    (acc, item) => acc + Number(item.expenses || 0),
    0
  );
  const totalSavings = savings.reduce(
    (acc, item) => acc + Number(item.savings || 0),
    0
  );
  const totalInvestments = investments.reduce(
    (acc, item) => acc + Number(item.investments || 0),
    0
  );

  const totalUsed = totalExpenses + totalSavings + totalInvestments;
  const remaining = totalIncome - totalUsed;

  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    totalInvestments,
    totalUsed,
    remaining,
    percentages: {
      expenses: totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0,
      savings: totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0,
      investments: totalIncome > 0 ? (totalInvestments / totalIncome) * 100 : 0,
    },
  };
};

// Fungsi untuk mendapatkan transaksi terakhir
const getRecentTransactions = (apiResponse, limit = 10) => {
  if (!apiResponse) return [];

  const {
    income = [],
    expenses = [],
    savings = [],
    investments = [],
  } = apiResponse;

  // Combine all transactions dengan type
  const allTransactions = [
    ...income.map(item => ({
      ...item,
      type: "pemasukan",
      amount: item.income,
    })),
    ...expenses.map(item => ({
      ...item,
      type: "pengeluaran",
      amount: item.expenses,
    })),
    ...savings.map(item => ({
      ...item,
      type: "tabungan",
      amount: item.savings,
    })),
    ...investments.map(item => ({
      ...item,
      type: "investasi",
      amount: item.investments,
    })),
  ];

  // Sort by date (newest first)
  return allTransactions
    .filter(item => item.date) // Filter yang punya tanggal
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};
// Di dalam ChartSection component
export function ChartSection() {
  const {
    income,
    sisa,
    pemakaian,
    loading,
    getAllFinancialData, // Pastikan ini di-export dari hook
  } = useFinancialData();

  const [chartData, setChartData] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");
  const isMobile = useIsMobile();

  // Load data saat component mount dan ketika timeRange berubah
  useEffect(() => {
    const loadData = async () => {
      const response = await getAllFinancialData();
      setApiData(response);

      if (response) {
        const data = generateChartDataFromAPI(response, timeRange);
        setChartData(data);
      }
    };

    loadData();
  }, [timeRange]);

  // Untuk mendapatkan current snapshot data
  const currentFinancialData = useMemo(() => {
    if (!apiData) return [];
    return createCurrentFinancialData(apiData);
  }, [apiData]);

  // Untuk mendapatkan summary
  const financialSummary = useMemo(() => {
    if (!apiData) return null;
    return getFinancialSummary(apiData);
  }, [apiData]);

  // Filter data berdasarkan timeRange
  const filteredData = useMemo(() => {
    if (!chartData.length) return [];

    const now = new Date();
    let daysBack = 30;
    if (timeRange === "7d") daysBack = 7;
    else if (timeRange === "90d") daysBack = 90;

    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    return chartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  }, [chartData, timeRange]);

  if (loading) {
    return (
      <Card className='@container/card'>
        <CardContent className='flex items-center justify-center h-[300px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2'></div>
            <p>Memuat data keuangan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Statistik Keuangan</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            {financialSummary ? (
              <>
                Pemasukan: Rp{" "}
                {financialSummary.totalIncome.toLocaleString("id-ID")} |
                Pemakaian: Rp{" "}
                {financialSummary.totalUsed.toLocaleString("id-ID")} | Sisa: Rp{" "}
                {financialSummary.remaining.toLocaleString("id-ID")}
              </>
            ) : (
              `Pemasukan: Rp ${income.jumlah.toLocaleString("id-ID")} | 
               Pemakaian: Rp ${pemakaian.toLocaleString("id-ID")} | 
               Sisa: Rp ${sisa.toLocaleString("id-ID")}`
            )}
          </span>
          <span className='@[540px]/card:hidden'>
            Total: Rp{" "}
            {financialSummary?.totalIncome.toLocaleString("id-ID") ||
              income.jumlah.toLocaleString("id-ID")}
          </span>
        </CardDescription>
        {/* TimeRange controls tetap sama */}
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'>
          <AreaChart data={filteredData}>
            {/* Chart configuration tetap sama */}
            <defs>
              <linearGradient
                id='fillPemasukan'
                x1='0'
                y1='0'
                x2='0'
                y2='1'>
                <stop
                  offset='5%'
                  stopColor='#10b981'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='#10b981'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id='fillPengeluaran'
                x1='0'
                y1='0'
                x2='0'
                y2='1'>
                <stop
                  offset='5%'
                  stopColor='#ef4444'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='#ef4444'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id='fillTabungan'
                x1='0'
                y1='0'
                x2='0'
                y2='1'>
                <stop
                  offset='5%'
                  stopColor='#3b82f6'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='#3b82f6'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id='fillInvestasi'
                x1='0'
                y1='0'
                x2='0'
                y2='1'>
                <stop
                  offset='5%'
                  stopColor='#8b5cf6'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='#8b5cf6'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value, name) => [
                    `Rp ${Number(value).toLocaleString("id-ID")}`,
                    name === "pemasukan"
                      ? "Pemasukan"
                      : name === "pengeluaran"
                      ? "Pengeluaran"
                      : name === "tabungan"
                      ? "Tabungan"
                      : "Investasi",
                  ]}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='pemasukan'
              type='natural'
              fill='url(#fillPemasukan)'
              stroke='#10b981'
              stackId='a'
            />
            <Area
              dataKey='pengeluaran'
              type='natural'
              fill='url(#fillPengeluaran)'
              stroke='#ef4444'
              stackId='b'
            />
            <Area
              dataKey='tabungan'
              type='natural'
              fill='url(#fillTabungan)'
              stroke='#3b82f6'
              stackId='c'
            />
            <Area
              dataKey='investasi'
              type='natural'
              fill='url(#fillInvestasi)'
              stroke='#8b5cf6'
              stackId='d'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
