import InvestasiLayout from "../components/investasi-layout";
import InvestasiCard from "../components/investasi-card";
export default function Investasi() {
  return (
    <InvestasiLayout>
      <div className="bg-white rounded-2xl p-6 shadow-md space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Data Investasi</h1>
        <InvestasiCard />
      </div>
    </InvestasiLayout>
  );
}
