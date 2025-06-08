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
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChartTemplate({
  titleChart,
  descriptionChart,
  dataChartRaw,
  configChart,
  valueKey,
}) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState([]);

  // Fungsi untuk memproses data mentah ke format yang bisa digunakan oleh Recharts
  React.useEffect(() => {
    if (!dataChartRaw) return;

    const processedData = dataChartRaw.map(item => ({
      date: item.date,
      value: item[valueKey], // Sesuaikan dengan properti data Anda
    }));

    setChartData(processedData);
  }, [dataChartRaw, valueKey]);

  // Fungsi untuk memfilter data berdasarkan rentang waktu
  const filteredData = React.useMemo(() => {
    const end = new Date();
    let start;

    switch (timeRange) {
      case "7d":
        start = new Date(end);
        start.setDate(end.getDate() - 7);
        break;
      case "30d":
        start = new Date(end);
        start.setDate(end.getDate() - 30);
        break;
      case "90d":
      default:
        start = new Date(end);
        start.setDate(end.getDate() - 90);
        break;
    }

    return chartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }, [chartData, timeRange]);

  return (
    <Card className='pt-0'>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1'>
          <CardTitle>{titleChart}</CardTitle>
          <CardDescription>{descriptionChart}</CardDescription>
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
          config={{
            value: {
              label: configChart.label,
              color: configChart.color,
            },
          }}
          className='aspect-auto h-[250px] w-full'>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient
                id={`fillValue`}
                x1='0'
                y1='0'
                x2='0'
                y2='1'>
                <stop
                  offset='5%'
                  stopColor={configChart.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor={configChart.color}
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
                  day: "numeric",
                  month: "short",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    const date = new Date(value);
                    return date.toLocaleDateString("id-ID", {
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
            <Area
              dataKey='value'
              type='monotone'
              fill={`url(#fillValue)`}
              stroke={configChart.color}
              stackId='1'
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
