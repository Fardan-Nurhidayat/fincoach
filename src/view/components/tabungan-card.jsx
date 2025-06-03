import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { tabungan } from "../../utils/Tabungan";

const chartData = tabungan.data;
const totalSaldo = tabungan.saldo;

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

const TabunganCard = () => {
  return (
    <Card className="border hover:border-purple-300/50 transition duration-300 shadow-md hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-purple-600 font-bold">
          Statistik Tabungan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Total Saldo */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Total Saldo</p>
          <h2 className="text-2xl font-extrabold text-purple-500">
            Rp {totalSaldo.toLocaleString("id-ID")}
          </h2>
        </div>

        {/* Chart */}
        <div className="h-56 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#f3e8ff" strokeDasharray="4 4" />
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
              <Line
                type="monotone"
                dataKey="nilai"
                stroke="#9333ea"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-purple-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100 text-purple-700">
                <TableHead className="text-center">Bulan</TableHead>
                <TableHead className="text-center">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{monthNames[item.bulan]}</TableCell>
                  <TableCell>Rp {item.nilai.toLocaleString("id-ID")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TabunganCard;