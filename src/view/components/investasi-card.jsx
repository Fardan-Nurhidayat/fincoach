import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "./ui/card";
import { investasi } from "../../utils/Investasi";

const chartData = investasi.data;
const totalSaldo = investasi.saldo;

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

const InvestasiCard = () => {
  return (
    <Card className="border-0 hover:border-purple-300/50 cursor-pointer hover:-translate-y-2.5 duration-300">
      <CardContent>
        {/* Saldo */}
        <div className="mb-4">
          <p className="text-m text-gray-500">Total Saldo</p>
          <h1 className="text-xl font-extrabold text-purple-400">
            Rp {totalSaldo.toLocaleString("id-ID")}
          </h1>
        </div>

        <h2 className="text-xl font-bold mb-4">Statistik Investasi</h2>

        {/* Chart */}
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

        {/* Table */}
        <table className="w-full text-left border-separate border-spacing-0 border border-purple-200 rounded-2xl overflow-hidden">
          <thead className="bg-purple-100 text-center">
            <tr>
              <th className="py-2 px-4 border-b">Bulan</th>
              <th className="py-2 px-4 border-b">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{monthNames[item.bulan]}</td>
                <td className="py-2 px-4 border-b">
                  Rp {item.nilai.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default InvestasiCard;
