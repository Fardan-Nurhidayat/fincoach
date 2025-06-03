import TabunganLayout from "../components/tabungan-layout";
import TabunganCard from "../components/tabungan-card";
export default function Tabungan() {
  return (
    <TabunganLayout>
      <div className="bg-white rounded-2xl p-6 shadow-md space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Tabungan</h1>
        <TabunganCard />
      </div>
    </TabunganLayout>
  );
}
