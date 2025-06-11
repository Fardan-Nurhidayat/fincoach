"use client";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/view/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/view/components/ui/select";

// Import hook dan konfigurasi
import { useFinancialData } from "@/hooks/useFinancialData";
import { useIsMobile } from "@/hooks/use-mobile";

// Konfigurasi warna dan label untuk chart
const chartConfig = {
  expenses: {
    label: "Pengeluaran ",
    color: "#dc2626",
  },
  savings: {
    label: "Tabungan ",
    color: "#16a34a",
  },
  investments: {
    label: "Investasi ",
    color: "#9333ea",
  },
};

export default function ChartSection() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const { getAllFinancialData } = useFinancialData();
  const [chartData, setChartData] = React.useState([]);

  // Fungsi untuk mengambil dan mentransformasi data
  const fetchAndTransformData = async () => {
    try {
      const data = await getAllFinancialData();
      const dailyTotals = new Map();

      ["expenses", "savings", "investments"].forEach(type => {
        data[type]?.forEach(item => {
          const date = new Date(item.date).toISOString().split("T")[0];

          if (!dailyTotals.has(date)) {
            dailyTotals.set(date, {
              date,
              expenses: 0,
              savings: 0,
              investments: 0,
            });
          }

          const amount = Number(item[type] || 0);
          const current = dailyTotals.get(date);
          current[type] += amount;
          dailyTotals.set(date, current);
        });
      });

      // Konversi ke array dan urutkan
      const transformedData = Array.from(dailyTotals.values()).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setChartData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchAndTransformData();
  }, []);

  // Filter data berdasarkan rentang waktu
  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];

    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;

    switch (timeRange) {
      case "90d":
        daysToSubtract = 90;
        break;
      case "30d":
        daysToSubtract = 30;
        break;
      case "7d":
        daysToSubtract = 7;
        break;
      case "1d":
        daysToSubtract = 1;
        break;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter(item => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [timeRange, chartData]);

  return (
    <Card className='pt-0'>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1'>
          <CardTitle>Keuangan Dashboard</CardTitle>
          <CardDescription>
            Menampilkan data terkini pengeluaran, tabungan, dan investasi
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
          aria-label='Pilih rentang waktu'>
          <SelectTrigger className='w-[160px] rounded-lg sm:ml-auto sm:flex'>
            <SelectValue placeholder='Pilih periode' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem
              value='90d'
              className='rounded-lg'>
              90 Hari Terakhir
            </SelectItem>
            <SelectItem
              value='30d'
              className='rounded-lg'>
              30 Hari Terakhir
            </SelectItem>
            <SelectItem
              value='7d'
              className='rounded-lg'>
              7 Hari Terakhir
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'>
          <AreaChart data={filteredData}>
            <defs>
              {Object.entries(chartConfig).map(([key, config]) => (
                <linearGradient
                  key={key}
                  id={`fill${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'>
                  <stop
                    offset='5%'
                    stopColor={config.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor={config.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
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
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  formatter={value => [`Rp ${value.toLocaleString("id-ID")}`]}
                  indicator='dot'
                />
              }
            />
            {Object.entries(chartConfig).map(([key, config]) => (
              <Area
                key={key}
                dataKey={key}
                type='monotone'
                fill={`url(#fill${key.charAt(0).toUpperCase() + key.slice(1)})`}
                stroke={config.color}
                stackId='1'
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
