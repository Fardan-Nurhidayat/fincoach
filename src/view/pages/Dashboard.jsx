import DashboardLayout from "../components/DashboardLayout";
import CardSection from "../components/CardSection";
import { ChartSection } from "../components/ChartSection";
// import { DialogTrigger } from "@/view/components/ui/dialog";
import DialogProfile from "../components/DiaLogProfile";

export default function Dashboard() {
  const getProfileResiko = localStorage.getItem("profileResiko");
  return (
    <DashboardLayout>
      <DialogProfile getProfilResiko={getProfileResiko} />
      <div className='h-full bg-white rounded-2xl p-8 shadow-sm'>
        <CardSection />
        <ChartSection />
      </div>
    </DashboardLayout>
  );
}
