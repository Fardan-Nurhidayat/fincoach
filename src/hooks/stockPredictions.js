import { useState, useEffect } from "react";

const symbols = [
  "BBCA",
  "BBRI",
  "BYAN",
  "TPIA",
  "BMRI",
  "DSSA",
  "TLKM",
  "ASII",
  "BBNI",
  "ICBP",
];

const BASE_GET_HISTORICAL =
  "https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history";
const BASE_GET_OPTIONS =
  "https://yahoo-finance15.p.rapidapi.com/api/v1/markets/options";
const getOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "b9fd585d97msh6ccc98155e9fad2p1b53b4jsn84adbcfe2b18",
    "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
  },
};
export const useStockPrediction = selectedSymbol => {
  const [latestPrice, setLatestPrice] = useState(0);
  const [chartData, setChartData] = useState("5m");
  const [latestPriceFromApi, setLatestPriceFromApi] = useState(0);
  const [prediksi, setPrediksi] = useState({
    oneDay: { nilai: 0, status: true, statusInPercent: 0 },
    oneWeek: { nilai: 0, status: true, statusInPercent: 0 },
    oneMonth: { nilai: 0, status: true, statusInPercent: 0 },
    threeMonth: { nilai: 0, status: true, statusInPercent: 0 },
    sixMonth: { nilai: 0, status: true, statusInPercent: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchLatestPriceFromApi = async symbol => {
    try {
      const url = `${BASE_GET_OPTIONS}?ticker=${symbol}`;
      const response = await fetch(url, getOptions);
      const result = await response.json();
      const regularMarketPrice = result.body[0].quote.regularMarketPrice;
      setLatestPriceFromApi(regularMarketPrice);
      return regularMarketPrice;
    } catch (error) {
      console.error("Gagal mengambil harga terakhir", error);
      alert("Gagal Memuat Data ".error);
    }
  };

  const fetchHistoryData = async (symbol, timeSeries) => {
    try {
      const url = `${BASE_GET_HISTORICAL}?symbol=${symbol}&interval=${timeSeries}`;
      const response = await fetch(url, getOptions);
      return response.json();
    } catch (error) {
      console.error("Gagal mengambil time series", error);
      alert("Gagal Memuat Data ".error);
    }
  };

  const fetchLatestPrice = async symbol => {
    try {
      const url = "https://satyavp-fincoach.hf.space/latest-stock";
      const response = await fetch(`${url}?symbol=${symbol}`);
      const data = await response.json();
      setLatestPrice(data[symbol]);
      return data[symbol];
    } catch (error) {
      console.error("Gagal mengambil harga terakhir", error);
      return 0;
    }
  };

  const fetchPredictionFromAPI = async symbol => {
    const url = "https://satyavp-fincoach.hf.space/predict";
    const response = await fetch(`${url}?symbol=${symbol}`);
    const result = await response.json();
    return result.predictions;
  };

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const [latest, predictionData] = await Promise.all([
        fetchLatestPrice(selectedSymbol.nasional),
        fetchPredictionFromAPI(selectedSymbol.nasional),
      ]);

      const formattedPrediksi = {
        oneDay: {
          nilai: predictionData["1_day"],
          status: predictionData["1_day"] > latest,
          statusInPercent: ((predictionData["1_day"] - latest) / latest) * 100,
        },
        oneWeek: {
          nilai: predictionData["1_week"],
          status: predictionData["1_week"] > latest,
          statusInPercent: ((predictionData["1_week"] - latest) / latest) * 100,
        },
        oneMonth: {
          nilai: predictionData["1_month"],
          status: predictionData["1_month"] > latest,
          statusInPercent:
            ((predictionData["1_month"] - latest) / latest) * 100,
        },
        threeMonth: {
          nilai: predictionData["3_months"],
          status: predictionData["3_months"] > latest,
          statusInPercent:
            ((predictionData["3_months"] - latest) / latest) * 100,
        },
        sixMonth: {
          nilai: predictionData["6_months"],
          status: predictionData["6_months"] > latest,
          statusInPercent:
            ((predictionData["6_months"] - latest) / latest) * 100,
        },
      };

      setPrediksi(formattedPrediksi);
    } catch (err) {
      setError("Gagal memuat prediksi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSymbol.nasional) {
      fetchPrediction();
      fetchLatestPriceFromApi(selectedSymbol.internasional);
    }
  }, [selectedSymbol.nasional]);

  return {
    latestPrice,
    latestPriceFromApi,
    prediksi,
    loading,
    error,
    symbols,
    fetchPrediction,
    fetchPredictionFromAPI,
    fetchLatestPriceFromApi,
    fetchHistoryData,
  };
};
