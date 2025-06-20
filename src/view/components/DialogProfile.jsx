import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/view/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/view/components/ui/dialog";
import { Input } from "@/view/components/ui/input";
import { Label } from "@/view/components/ui/label";
import { useFinancialData } from "@/hooks/useFinancialData";
import { Loader2 } from "lucide-react"; // Import loading spinner

// Helper functions remain the same
function getProfileRiskName(investmentsLimit) {
  if (investmentsLimit <= 20) return "Rendah";
  if (investmentsLimit <= 50) return "Moderate";
  return "Tinggi";
}

function getProfileDescription(name) {
  const descriptions = {
    Rendah:
      "Profil risiko rendah: alokasi investasi kecil, cocok untuk yang mengutamakan keamanan.",
    Moderate:
      "Profil risiko moderat: investasi sedang, seimbang antara pertumbuhan dan keamanan.",
    Tinggi:
      "Profil risiko tinggi: investasi besar, cocok untuk yang siap menghadapi risiko tinggi demi potensi hasil besar.",
  };
  return descriptions[name] || descriptions.Moderate;
}

export default function DialogProfile({ profilResiko, refreshData }) {
  // States
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingState, setLoadingState] = useState({
    submit: false,
    saving: false,
    refreshing: false,
  });
  const { postProfileRisk, updateProfileRisk } = useFinancialData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    expensesLimit: "",
    savingsLimit: "",
    investmentsLimit: "",
  });
  const [error, setError] = useState(null);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Form initialization effect
  useEffect(() => {
    if (open && !isFormInitialized) {
      if (profilResiko && Object.keys(profilResiko).length > 0) {
        setForm({
          expensesLimit: profilResiko.expensesLimit?.toString() || "",
          savingsLimit: profilResiko.savingsLimit?.toString() || "",
          investmentsLimit: profilResiko.investmentsLimit?.toString() || "",
        });
      } else {
        setForm({
          expensesLimit: "",
          savingsLimit: "",
          investmentsLimit: "",
        });
      }
      setIsFormInitialized(true);
    }
  }, [open, profilResiko, isFormInitialized]);

  // Dialog close effect
  useEffect(() => {
    if (!open) {
      setIsFormInitialized(false);
      setError(null);
      setLoadingState({
        submit: false,
        saving: false,
        refreshing: false,
      });
    }
  }, [open]);

  // Form change handler
  const handleChange = useCallback(
    e => {
      const { name, value } = e.target;
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
      if (error) setError(null);
    },
    [error]
  );

  // Form validation
  const validateForm = useCallback(
    (expensesLimit, savingsLimit, investmentsLimit) => {
      if (
        isNaN(expensesLimit) ||
        isNaN(savingsLimit) ||
        isNaN(investmentsLimit)
      ) {
        return "Semua alokasi harus berupa angka.";
      }

      if (expensesLimit < 0 || savingsLimit < 0 || investmentsLimit < 0) {
        return "Semua alokasi harus berupa angka positif.";
      }

      if (expensesLimit > 100 || savingsLimit > 100 || investmentsLimit > 100) {
        return "Setiap alokasi tidak boleh lebih dari 100%.";
      }

      const total = expensesLimit + savingsLimit + investmentsLimit;
      if (total !== 100) {
        return `Total alokasi harus 100%. Saat ini: ${total}%`;
      }

      return null;
    },
    []
  );

  // Submit handler with loading states
  const submitHandler = async e => {
    e.preventDefault();
    setError(null);
    setLoadingState(prev => ({ ...prev, submit: true }));

    try {
      const formData = new FormData(e.target);
      const expensesLimit = parseInt(formData.get("expensesLimit")) || 0;
      const savingsLimit = parseInt(formData.get("savingsLimit")) || 0;
      const investmentsLimit = parseInt(formData.get("investmentsLimit")) || 0;

      // Validation
      const validationError = validateForm(
        expensesLimit,
        savingsLimit,
        investmentsLimit
      );
      if (validationError) {
        setError(validationError);
        return;
      }

      const name = getProfileRiskName(investmentsLimit);
      const desc = getProfileDescription(name);

      setLoadingState(prev => ({ ...prev, saving: true }));

      let updatedProfile;
      if (profilResiko && profilResiko.id) {
        updatedProfile = await updateProfileRisk({
          id: profilResiko.id,
          name,
          desc,
          expensesLimit,
          savingsLimit,
          investmentsLimit,
        });
      } else {
        updatedProfile = await postProfileRisk({
          name,
          desc,
          expensesLimit,
          savingsLimit,
          investmentsLimit,
        });
      }

      if (updatedProfile) {
        setLoadingState(prev => ({ ...prev, refreshing: true }));
        await refreshData();
        setOpen(false);
        setForm({
          expensesLimit: "",
          savingsLimit: "",
          investmentsLimit: "",
        });
        setIsFormInitialized(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.");
    } finally {
      setLoadingState({
        submit: false,
        saving: false,
        refreshing: false,
      });
      window.location.reload();
    }
  };

  // Calculate current total
  const currentTotal =
    (parseInt(form.expensesLimit) || 0) +
    (parseInt(form.savingsLimit) || 0) +
    (parseInt(form.investmentsLimit) || 0);

  const isLoading =
    loadingState.submit || loadingState.saving || loadingState.refreshing;
  const loadingText = loadingState.refreshing
    ? "Memperbarui data..."
    : loadingState.saving
    ? "Menyimpan..."
    : "Memproses...";

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          {profilResiko && profilResiko.id
            ? "Edit Profil Risiko"
            : "Buat Profil Risiko"}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {profilResiko && profilResiko.id ? "Edit" : "Lengkapi"} Profil
            Risiko Anda
          </DialogTitle>
          <DialogDescription>
            Lengkapi formulir di bawah ini untuk menentukan profil risiko
            keuangan Anda. Total persentase harus 100%.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-3'>
              <Label htmlFor='expensesLimit'>
                Berapa persen anda ingin mengalokasikan <b>pengeluaran</b> anda?
              </Label>
              <Input
                id='expensesLimit'
                name='expensesLimit'
                type='number'
                min={0}
                max={100}
                placeholder='Contoh: 50'
                value={form.expensesLimit}
                onChange={handleChange}
                required
                disabled={loadingSubmit}
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='savingsLimit'>
                Berapa persen anda ingin mengalokasikan <b>tabungan</b> anda?
              </Label>
              <Input
                id='savingsLimit'
                name='savingsLimit'
                type='number'
                min={0}
                max={100}
                placeholder='Contoh: 30'
                value={form.savingsLimit}
                onChange={handleChange}
                required
                disabled={loadingSubmit}
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='investmentsLimit'>
                Berapa persen anda ingin mengalokasikan <b>investasi</b> anda?
              </Label>
              <Input
                id='investmentsLimit'
                name='investmentsLimit'
                type='number'
                min={0}
                max={100}
                placeholder='Contoh: 20'
                value={form.investmentsLimit}
                onChange={handleChange}
                required
                disabled={loadingSubmit}
              />
            </div>

            {/* Tampilkan total saat ini */}
            <div className='text-sm text-gray-600'>
              Total saat ini:{" "}
              <span
                className={
                  currentTotal === 100
                    ? "text-green-600 font-semibold"
                    : currentTotal > 100
                    ? "text-red-600 font-semibold"
                    : "text-gray-600"
                }>
                {currentTotal}%
              </span>
            </div>

            {error && (
              <div className='text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200'>
                {error}
              </div>
            )}
          </div>
          <DialogFooter className='flex justify-end gap-2 mt-4'>
            <DialogClose asChild>
              <Button
                variant='outline'
                type='button'
                disabled={isLoading}>
                Batal
              </Button>
            </DialogClose>
            <Button
              type='submit'
              disabled={isLoading || currentTotal !== 100}
              className='relative'>
              {isLoading ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                  {loadingText}
                </>
              ) : (
                "Simpan Profil"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
