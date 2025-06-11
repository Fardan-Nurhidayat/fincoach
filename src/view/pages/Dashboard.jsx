import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/view/components/DashboardLayout";
import DialogProfile from "@/view/components/DialogProfile";
import CardSection from "@/view/components/CardSection";
import ChartSection from "@/view/components/ChartSection";
import { useFinancialData } from "@/hooks/useFinancialData";

export default function Dashboard() {
  const {
    getProfilResiko,
    getIncome,
    profilResiko: initialProfilResiko,
  } = useFinancialData();

  const [profilResiko, setProfilResiko] = useState(null);
  const [dataVersion, setDataVersion] = useState(0); // trigger rerender

  const refreshData = useCallback(async () => {
    const updated = await getProfilResiko();
    setProfilResiko(updated);
    await getIncome(updated);
    setDataVersion(prev => prev + 1);
  }, [getProfilResiko, getIncome]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (!profilResiko) {
    return <div>Memuat...</div>;
  }

  return (
    <DashboardLayout>
      <DialogProfile
        profilResiko={profilResiko}
        refreshData={refreshData}
      />
      <div className='h-full bg-white rounded-2xl p-8 shadow-sm'>
        <CardSection
          profilResiko={profilResiko}
          dataVersion={dataVersion}
        />
        <ChartSection />
      </div>
    </DashboardLayout>
  );
}
