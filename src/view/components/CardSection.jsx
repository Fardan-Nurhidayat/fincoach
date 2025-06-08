import { ToastContainer, toast } from "react-toastify";

import { profilResiko } from "../../utils/CardDashboard.js";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "./ui/card";

import { IconPlus } from "@tabler/icons-react";
import { useFinancialData } from "../../hooks/useFinancialData.js";
export default function CardSection() {
  const {
    income,
    expensesState,
    savingsState,
    investmentsState,
    sisa,
    pemakaian,
    postIncome,
    postExpense,
    postSavings,
    postInvestment,
    toastConfig,
  } = useFinancialData();
  const incomeHandler = async e => {
    e.preventDefault();
    const amount = parseInt(e.target.pemasukan.value, 10);
    const desc = e.target.sumber.value;
    await postIncome(amount, desc);
    e.target.pemasukan.value = "";
    e.target.sumber.value = "";
  };
  const actionHandler = async e => {
    e.preventDefault();
    const status = e.target.status.value;
    const amount = parseInt(e.target.amount.value, 10);
    const desc = e.target.desc.value;

    if (status === "expense") {
      if (amount => expensesState.limit) {
        toast.error("Pengeluaran melebihi batas limit!", toastConfig);
        return;
      } else if (expensesState.jumlah + amount >= expensesState.limit) {
        toast.error(
          "Pengeluaran sudah melebihi jumlah yang tersedia!",
          toastConfig
        );
        return;
      } else if (sisa <= amount) {
        toast.error(
          "Sisa dana tidak cukup untuk menambah pengeluaran!",
          toastConfig
        );
        return;
      }

      await postExpense(amount, desc);
    } else if (status === "saving") {
      if (amount => savingsState.limit) {
        toast.error("Tabungan melebihi batas limit!", toastConfig);
        return;
      } else if (savingsState.jumlah + amount >= savingsState.limit) {
        toast.error(
          "Tabungan sudah melebihi jumlah yang tersedia!",
          toastConfig
        );
        return;
      } else if (sisa < amount) {
        toast.error(
          "Sisa dana tidak cukup untuk menambah tabungan!",
          toastConfig
        );
        return;
      }
      await postSavings(amount, desc);
    } else if (status === "investment") {
      if (amount => investmentsState.limit) {
        toast.error("Investasi melebihi batas limit!", toastConfig);
        return;
      } else if (investmentsState.jumlah + amount >= investmentsState.limit) {
        toast.error(
          "Investasi sudah melebihi jumlah yang tersedia!",
          toastConfig
        );
        return;
      } else if (sisa < amount) {
        toast.error("Sisa dana tidak cukup untuk investasi!", toastConfig);
        return;
      }

      await postInvestment(amount, desc);
    }

    // Kosongkan input
    e.target.amount.value = "";
    e.target.desc.value = "";
  };

  const data = [
    {
      title: "Pengeluaran",
      value: expensesState.jumlah || 0,
      limit: expensesState.limit || 0,
      color: "red",
      colorGradient: "from-red-500 to-red-100",
      iconGradient: "from-red-500 to-orange-500",
      status: "expense",
    },
    {
      title: "Tabungan",
      value: savingsState.jumlah || 0,
      limit: savingsState.limit || 0,
      color: "blue",
      iconGradient: "from-blue-500 to-cyan-500",
      colorGradient: "from-blue-500 to-blue-100",
      status: "saving",
    },
    {
      title: "Investasi",
      value: investmentsState.jumlah || 0,
      limit: investmentsState.limit || 0,
      color: "emerald",
      iconGradient: "from-emerald-500 to-green-500",
      colorGradient: "from-emerald-500 to-emerald-100",
      status: "investment",
    },
  ];
  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
      {/* Kartu Input Pemasukan */}

      <Card className='border-0 hover:border-emerald-300/50 cursor-pointer hover:-translate-y-2.5 duration-300'>
        <CardHeader>
          <CardTitle className='text-slate-700 group-hover:text-emerald-700 transition-colors duration-300'>
            Pemasukan
          </CardTitle>
          <CardDescription className='text-slate-600'>
            {profilResiko.pengeluaran}% / {profilResiko.tabungan}% /{" "}
            {profilResiko.investasi}%
          </CardDescription>
          <CardAction>
            <Dialog>
              <DialogTrigger asChild>
                <button className='p-3 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 cursor-pointer text-white hover:from-emerald-600 hover:to-blue-600 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 group-hover:shadow-xl'>
                  <IconPlus size={20} />
                </button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Tambah Pemasukan</DialogTitle>
                  <DialogDescription>
                    Masukkan jumlah pemasukan baru Anda.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={incomeHandler}>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label
                        htmlFor='pemasukan'
                        className='text-right'>
                        Jumlah
                      </Label>
                      <Input
                        id='pemasukan'
                        type='number'
                        placeholder='Masukkan jumlah'
                        className='col-span-3'
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label
                        htmlFor='sumber'
                        className='text-right'>
                        Sumber
                      </Label>
                      <Input
                        id='sumber'
                        placeholder='Gaji, bonus, dll'
                        className='col-span-3'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type='submit'
                      className='bg-gradient-to-r cursor-pointer from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600'>
                      Simpan Pemasukan
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <CardDescription className='text-xl sm:text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors'>
              Rp. {income.jumlah.toLocaleString("id-ID")}
            </CardDescription>
            <CardDescription className='text-md sm:text-xl font-bold text-slate-400 group-hover:text-slate-900 transition-colors'>
              Sisa Rp. {sisa.toLocaleString("id-ID")}
            </CardDescription>
            <CardDescription className='text-md sm:text-xl font-bold text-slate-400 group-hover:text-slate-900 transition-colors'>
              Pemakaian Rp. {pemakaian.toLocaleString("id-ID")}
            </CardDescription>
            {/* <div className='flex items-center gap-2 text-xs text-emerald-600'> */}
            {/* <div className='p-3 rounded-full bg-emerald-100'>IDR</div> */}
            {/* <span>Total pemasukan bulan ini</span> */}
            {/* </div> */}
          </div>
        </CardContent>
      </Card>

      {data.map((item, index) => {
        const percentage =
          item.limit && item.value
            ? Math.min((item.value / item.limit) * 100, 100).toFixed(0)
            : 0;
        return (
          <Card
            key={index}
            className={`border-0 hover:border-${item.color}-300/50 cursor-pointer hover:-translate-y-2.5 duration-300`}>
            <CardHeader>
              <CardTitle
                className={`text-slate-700 group-hover:text-${item.color}-700 transition-colors duration-300`}>
                {item.title}
              </CardTitle>
              <CardDescription className='text-slate-600'>
                Maks: Rp. {item.limit.toLocaleString("id-ID")}
              </CardDescription>
              <CardAction className='absolute top-4 right-4'>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className={`p-3 rounded-full bg-gradient-to-r ${item.iconGradient} cursor-pointer text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-${item.color}-500/25 group-hover:shadow-xl`}>
                      <IconPlus size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                      <DialogTitle>Tambah {item.title}</DialogTitle>
                      <DialogDescription>
                        {item.status === "expense" &&
                          "Catat pengeluaran baru Anda."}
                        {item.status === "saving" &&
                          "Tambah dana ke tabungan Anda."}
                        {item.status === "investment" &&
                          "Tambah investasi baru ke portfolio."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={actionHandler}>
                      <input
                        type='hidden'
                        name='status'
                        value={item.status}
                      />

                      <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <Label
                            htmlFor={`amount-${index}`}
                            className='text-right'>
                            Jumlah
                          </Label>
                          <Input
                            id={`amount-${index}`}
                            name='amount'
                            required
                            type='number'
                            placeholder='Masukkan jumlah'
                            className='col-span-3'
                          />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <Label
                            htmlFor={`desc-${index}`}
                            className='text-right'>
                            {item.status === "expense"
                              ? "Kategori"
                              : item.status === "saving"
                              ? "Tujuan"
                              : "Instrumen"}
                          </Label>
                          <Input
                            id={`desc-${index}`}
                            name='desc'
                            required
                            placeholder={
                              item.status === "expense"
                                ? "Makanan, Transport, dll"
                                : item.status === "saving"
                                ? "Emergency fund, dll"
                                : "Saham, Reksadana, dll"
                            }
                            className='col-span-3'
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type='submit'
                          className={`bg-gradient-to-r ${item.iconGradient}`}>
                          Simpan {item.title}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <CardDescription className='text-xl sm:text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors'>
                  Rp. {item.value.toLocaleString("id-ID")}
                </CardDescription>
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-slate-600'>Limit</span>
                    <span className={`text-${item.color}-600 font-medium`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className='w-full bg-slate-200 rounded-full h-2'>
                    <div
                      className={`bg-gradient-to-l ${item.colorGradient} h-2 rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <ToastContainer />
    </div>
  );
}
