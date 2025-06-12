import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/view/components/DashboardLayout";
import DialogProfile from "@/view/components/DialogProfile";
import CardSection from "@/view/components/CardSection";
import ChartSection from "@/view/components/ChartSection";
import { useFinancialData } from "@/hooks/useFinancialData";

export default function Dashboard() {
  const {
    expensesState,
    savingsState,
    investmentsState,
    income,
    sisa,
    pemakaian,
    postExpense,
    postSavings,
    postInvestment,
    postIncome,
    profilResiko,
    dataVersion,
    refreshData,
    toastConfig,
  } = useFinancialData();

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
          expensesState={expensesState}
          savingsState={savingsState}
          investmentsState={investmentsState}
          income={income}
          sisa={sisa}
          pemakaian={pemakaian}
          postExpense={postExpense}
          postSavings={postSavings}
          postInvestment={postInvestment}
          postIncome={postIncome}
          toastConfig={toastConfig}
        />
        <ChartSection />
      </div>
    </DashboardLayout>
  );
}
