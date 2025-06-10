import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useStockPrediction } from "@/hooks/stockPredictions";
import ChartPrediksiSaham from "./prediksi-saham-chart";
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

const symbols2 = {
  BBCA: {
    nasional: "BBCA",
    internasional: "BBCA.JK",
  },
  BBRI: {
    nasional: "BBRI",
    internasional: "BBRI.JK",
  },
  BYAN: {
    nasional: "BYAN",
    internasional: "BYAN.JK",
  },
  TPIA: {
    nasional: "TPIA",
    internasional: "TPIA.JK",
  },
  BMRI: {
    nasional: "BMRI",
    internasional: "BMRI.JK",
  },
  DSSA: {
    nasional: "DSSA",
    internasional: "DSSA.JK",
  },
  TLKM: {
    nasional: "TLKM",
    internasional: "TLKM.JK",
  },
  ASII: {
    nasional: "ASII",
    internasional: "ASII",
  },
  BBNI: {
    nasional: "BBNI",
    internasional: "BBNI.JK",
  },
  ICBP: {
    nasional: "ICBP",
    internasional: "ICBP.JK",
  },
};

const PrediksiSahamCard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedSymbol = symbols2[symbols[selectedIndex]];

  const { latestPrice, latestPriceFromApi, prediksi, loading, error } =
    useStockPrediction(selectedSymbol);

  const prediksiCards = [
    { label: "1 Hari", data: prediksi.oneDay },
    { label: "1 Minggu", data: prediksi.oneWeek },
    { label: "1 Bulan", data: prediksi.oneMonth },
    { label: "3 Bulan", data: prediksi.threeMonth },
    { label: "6 Bulan", data: prediksi.sixMonth },
  ];

  return (
    <Card className='border hover:border-purple-300/50 transition duration-300 shadow-md hover:shadow-lg'>
      <CardHeader>
        <CardTitle className='text-xl text-purple-600 font-bold'>
          Statistik Saham
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-4'>
          <label className='text-sm text-gray-600 block mb-1'>
            Pilih Perusahaan
          </label>
          <select
            className='border border-gray-300 rounded-md px-3 py-2 w-full'
            value={selectedIndex}
            onChange={e => setSelectedIndex(parseInt(e.target.value))}>
            {symbols.map((item, index) => (
              <option
                key={item}
                value={index}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className='text-center py-4 text-gray-500'>
            Memuat prediksi...
          </div>
        )}

        {/* Error State */}
        {error && <div className='text-center py-4 text-red-500'>{error}</div>}

        {/* Chart */}
        {!loading && !error && (
          <div className='mb-6'>
            <ChartPrediksiSaham symbol={selectedSymbol.internasional} />
          </div>
        )}
        {/* Prediction Cards */}
        {!loading && !error && (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6'>
            {prediksiCards.map((item, index) => {
              const { nilai, status, statusInPercent } = item.data;
              return (
                <Card
                  key={index}
                  className='border-0 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group transform rounded-xl overflow-hidden'>
                  <CardContent className='p-5 flex flex-col justify-between h-full'>
                    <div>
                      <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 mb-3'>
                        {item.label}
                      </span>
                      <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                        {item.label}
                      </h3>
                    </div>

                    <div className='flex items-center gap-2 mb-2'>
                      <div
                        className={`p-2 rounded-full ${
                          status
                            ? "bg-green-100 text-green-500"
                            : "bg-red-100 text-red-500"
                        } group-hover:scale-110 transition-transform duration-300`}>
                        {status ? (
                          <ArrowUpRight size={16} />
                        ) : (
                          <ArrowDownRight size={16} />
                        )}
                      </div>
                      <span
                        className={`text-xl font-bold ${
                          status ? "text-green-500" : "text-red-500"
                        }`}>
                        Rp {nilai.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          status ? "text-green-500" : "text-red-500"
                        }`}>
                        {statusInPercent.toFixed(2)}%
                      </span>
                    </div>

                    <p
                      className={`text-sm mt-2 ${
                        status ? "text-green-500" : "text-red-500"
                      }`}>
                      {status ? "Naik" : "Turun"} dibanding harga terbaru
                    </p>

                    <p className='text-xs text-gray-500 mt-1'>
                      Harga terakhir: Rp{" "}
                      {latestPriceFromApi.toLocaleString("id-ID")}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrediksiSahamCard;
