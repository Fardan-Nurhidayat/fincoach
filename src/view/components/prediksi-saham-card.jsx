import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { sahamPerusahaanData } from "../../utils/SahamPerusahaan";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const monthNames = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PrediksiSahamCard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const perusahaan = sahamPerusahaanData.perusahaan[selectedIndex];
  const chartData = perusahaan.data;
  const prediksi = perusahaan.prediksi;

  const prediksiCards = [
    {
      label: "1 Hari",
      data: prediksi.harian,
    },
    {
      label: "1 Minggu",
      data: prediksi.mingguan,
    },
    {
      label: "1 Bulan",
      data: prediksi.bulanan,
    },
  ];  

  return (
    <Card className="border-0 hover:border-purple-300/50">
      <CardContent>
        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-1">
            Pilih Perusahaan
          </label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
          >
            {sahamPerusahaanData.perusahaan.map((item, idx) => (
              <option key={idx} value={idx}>
                {item.nama}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-bold mb-4">Saham Perusahaan</h2>

        <div className="h-56 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="nilai"
                stroke="#5a199b"
                strokeWidth={2}
              />
              <CartesianGrid stroke="#ecc9ff" strokeDasharray="5 5" />
              <XAxis
                dataKey="bulan"
                tickFormatter={(bulan) => monthNames[bulan]}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(bulan) => `Bulan: ${monthNames[bulan]}`}
                formatter={(nilai) => [
                  `Rp ${nilai.toLocaleString("id-ID")}`,
                  "Nilai",
                ]}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {prediksiCards.map((item, index) => (
            <Card
              key={index}
              className="border-0 hover:border-purple-300/50 cursor-pointer hover:-translate-y-2.5 duration-300"
            >
              <CardContent className="py-4">
                <p className="text-sm text-gray-500 mb-1">Prediksi</p>
                <h3 className="text-lg font-semibold mb-2">{item.label}</h3>
                <div className="flex items-center gap-2">
                  {item.data.naik ? (
                    <ArrowUpRight className="text-green-500" />
                  ) : (
                    <ArrowDownRight className="text-red-500" />
                  )}
                  <span
                    className={`text-lg font-bold ${
                      item.data.naik ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    Rp {item.data.nilai.toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {item.data.naik ? "Naik" : "Turun"} dibanding periode
                  sebelumnya
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrediksiSahamCard;
