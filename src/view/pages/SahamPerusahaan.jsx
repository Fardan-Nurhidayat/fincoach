import PrediksiSahamLayout from "../components/prediksi-saham-layout";
import PrediksiSahamCard from "../components/prediksi-saham-card";
export default function SahamPerusahaan() {
  return (
    <PrediksiSahamLayout>
      <div className='bg-white rounded-2xl p-6 shadow-md space-y-8'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Saham Perusahaan dan Prediksi
        </h1>
        <PrediksiSahamCard />
      </div>
    </PrediksiSahamLayout>
  );
}
