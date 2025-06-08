import DashboardLayout from "../components/DashboardLayout";
import CardSection from "../components/CardSection";
import { ChartSection } from "../components/ChartSection";
export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className='h-full bg-white rounded-2xl p-8 shadow-sm'>
        <CardSection />
        <ChartSection />
      </div>
    </DashboardLayout>
  );
}
