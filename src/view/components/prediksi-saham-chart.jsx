import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/view/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/view/components/ui/chart";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/view/components/ui/toggle-group";
import { useStockPrediction } from "@/hooks/stockPredictions";

const chartConfig = {
  price: {
    label: "Harga Saham",
    color: "#4CAF50",
  },
};

// Konfigurasi time range
const TIME_RANGES = {
  "5m": { label: "5 Menit", days: 0, hours: 1 },
  "15m": { label: "15 Menit", days: 0, hours: 4 },
  "30m": { label: "30 Menit", days: 0, hours: 8 },
  "1h": { label: "1 Jam", days: 1, hours: 0 },
  "1d": { label: "1 Hari", days: 7, hours: 0 },
  "1wk": { label: "1 Minggu", days: 30, hours: 0 },
  "1mo": { label: "1 Bulan", days: 90, hours: 0 },
  "3mo": { label: "3 Bulan", days: 270, hours: 0 },
};

export default function ChartPrediksiSaham({ symbol }) {
  const { fetchHistoryData } = useStockPrediction(symbol);
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("1d");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockInfo, setStockInfo] = useState(null);
  const [error, setError] = useState(null);

  // Ref to avoid rerender loop while loading
  const didFetch = useRef(false);

  // Set default time range untuk mobile
  useEffect(() => {
    if (isMobile && timeRange === "1mo") {
      setTimeRange("1wk");
    }
    // only run this effect when isMobile or timeRange changes
    // eslint-disable-next-line
  }, [isMobile]);

  // Memoize expensive calculations
  const maxDataPoints = useMemo(() => {
    const pointsMap = {
      "5m": 40,
      "15m": 40,
      "30m": 30,
      "1h": 20,
      "1d": 20,
      "1wk": 20,
      "1mo": 20,
      "3mo": 20,
    };
    return pointsMap[timeRange] || 100;
  }, [timeRange]);

  // Memoize transform function to prevent recreation
  const transformApiDataToChartData = useCallback(
    (apiResponse, maxPoints = 100) => {
      if (!apiResponse?.body) return [];

      const bodyData = apiResponse.body;
      const allData = Object.keys(bodyData)
        .map(timestamp => {
          const item = bodyData[timestamp];
          return {
            date: new Date(item.date).toLocaleString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            datetime: new Date(item.date_utc * 1000).toLocaleTimeString(
              "id-ID",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            price: parseFloat(item.close) || 0,
            open: parseFloat(item.open) || 0,
            high: parseFloat(item.high) || 0,
            low: parseFloat(item.low) || 0,
            volume: parseInt(item.volume) || 0,
            timestamp: item.date_utc,
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp);

      if (allData.length > maxPoints) {
        return allData.slice(-maxPoints);
      }
      return allData;
    },
    []
  );

  // Debounce stock data load for efficiency
  const debounceTimeout = useRef(null);

  const loadStockData = useCallback(() => {
    if (!symbol) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    setLoading(true);
    setError(null);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await fetchHistoryData(symbol, timeRange);

        if (!response) {
          throw new Error("No data received");
        }

        const transformedData = transformApiDataToChartData(
          response,
          maxDataPoints
        );
        setChartData(transformedData);

        if (response.meta) {
          setStockInfo(response.meta);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading stock data:", err);
        setError(err.message || "Gagal memuat data saham");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }, 200); // 200ms debounce
  }, [
    symbol,
    timeRange,
    maxDataPoints,
    transformApiDataToChartData,
    fetchHistoryData,
  ]);

  // Filter data berdasarkan time range (sekarang hanya untuk display formatting)
  const getDisplayFormat = useCallback(range => {
    const inMonth = range.includes("mo");
    if (inMonth) return "date";
    const isIntraday = range.includes("m") || range.includes("h");
    return isIntraday ? "datetime" : "date";
  }, []);

  // Load data only if not already fetching for this symbol/timerange
  useEffect(() => {
    if (!symbol) return;
    if (didFetch.current && chartData.length > 0) return; // Prevent duplicate fetches
    didFetch.current = true;
    loadStockData();
    // eslint-disable-next-line
  }, [symbol, timeRange]);

  // Reset fetch flag when timeRange changes (so we can fetch again)
  useEffect(() => {
    didFetch.current = false;
  }, [timeRange, symbol]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  // Format price untuk display
  const formatPrice = useCallback(
    price => {
      if (price === undefined || price === null) return "N/A";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: stockInfo?.currency || "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(price);
    },
    [stockInfo]
  );

  // Custom tooltip
  const CustomTooltip = useCallback(
    ({ active, payload, label }) => {
      if (!active || !payload?.length) return null;
      const data = payload[0].payload;
      return (
        <div className='bg-white p-3 border rounded-lg shadow-lg'>
          <p className='font-medium text-sm mb-2'>{label}</p>
          <div className='space-y-1 text-xs'>
            <p className='text-green-600 font-medium'>
              Close: {formatPrice(data.price)}
            </p>
            <p className='text-gray-600'>Open: {formatPrice(data.open)}</p>
            <p className='text-gray-600'>High: {formatPrice(data.high)}</p>
            <p className='text-gray-600'>Low: {formatPrice(data.low)}</p>
            {data.volume && (
              <p className='text-gray-600'>
                Volume: {data.volume.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>
      );
    },
    [formatPrice]
  );

  // Determine which time ranges to show based on screen size
  const getVisibleTimeRanges = useCallback(() => {
    if (isMobile) {
      return ["1d", "1wk", "1mo"];
    }
    return Object.keys(TIME_RANGES);
  }, [isMobile]);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>
          {stockInfo?.longName || stockInfo?.symbol || `Grafik Saham ${symbol}`}
        </CardTitle>
        <CardDescription>
          {stockInfo ? (
            <span>
              <span className='hidden @[540px]/card:inline'>
                Harga: {formatPrice(stockInfo.regularMarketPrice)} |{" "}
                {stockInfo.currency}
              </span>
              <span className='@[540px]/card:hidden'>
                {formatPrice(stockInfo.regularMarketPrice)}
              </span>
            </span>
          ) : (
            "Memuat informasi saham..."
          )}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={setTimeRange}
            variant='outline'
            className='hidden @[767px]/card:flex'>
            {getVisibleTimeRanges().map(range => (
              <ToggleGroupItem
                key={range}
                value={range}>
                {TIME_RANGES[range].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {/* Mobile selector */}
          <div className='@[767px]/card:hidden'>
            <ToggleGroup
              type='single'
              value={timeRange}
              onValueChange={setTimeRange}
              variant='outline'
              className='grid grid-cols-3 gap-1'>
              {getVisibleTimeRanges().map(range => (
                <ToggleGroupItem
                  key={range}
                  value={range}
                  className='text-xs'>
                  {TIME_RANGES[range].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {loading ? (
          <div className='flex items-center justify-center h-80'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-80'>
            <div className='text-center'>
              <p className='text-red-500 mb-2'>Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className='text-blue-500 hover:underline'>
                Coba lagi
              </button>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <LineChart
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
              />
              <XAxis
                dataKey={getDisplayFormat(timeRange)}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={["dataMin * 0.99", "dataMax * 1.01"]}
                tickFormatter={value =>
                  Math.round(value).toLocaleString("id-ID")
                }
                fontSize={12}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Line
                dataKey='price'
                type='monotone'
                stroke='var(--color-price)'
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className='flex items-center justify-center h-80'>
            <p className='text-muted-foreground'>
              Tidak ada data untuk ditampilkan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
