import {
  profilResiko,
  pemasukan,
  pengeluaran,
  tabungan,
  investasi,
} from "../../utils/CardDashboard.js";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function CardSection() {
  const data = [
    {
      title: "Pengeluaran",
      value: pengeluaran.jumlah,
      limit: (profilResiko.pengeluaran / 100) * pemasukan.jumlah,
      color: "red",
      iconGradient: "from-red-500 to-orange-500",
      status: "expense",
    },
    {
      title: "Tabungan",
      value: tabungan.jumlah,
      limit: (profilResiko.tabungan / 100) * pemasukan.jumlah,
      iconGradient: "from-blue-500 to-cyan-500",
      color: "blue",
      status: "saving",
    },
    {
      title: "Investasi",
      value: investasi.jumlah,
      limit: (profilResiko.investasi / 100) * pemasukan.jumlah,
      iconGradient: "from-emerald-500 to-green-500",
      color: "emerald",
      status: "investment",
    },
  ];
  const sisa =
    pemasukan.jumlah -
    (tabungan.jumlah + pengeluaran.jumlah + investasi.jumlah);

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
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label
                      htmlFor='income'
                      className='text-right'>
                      Jumlah
                    </Label>
                    <Input
                      id='income'
                      placeholder='Masukkan jumlah'
                      className='col-span-3'
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label
                      htmlFor='source'
                      className='text-right'>
                      Sumber
                    </Label>
                    <Input
                      id='source'
                      placeholder='Gaji, bonus, dll'
                      className='col-span-3'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type='submit'
                    className='bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600'>
                    Simpan Pemasukan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <CardDescription className='text-xl sm:text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors'>
              Rp. {pemasukan.jumlah.toLocaleString("id-ID")}
            </CardDescription>
            <CardDescription className='text-md sm:text-xl font-bold text-slate-400 group-hover:text-slate-900 transition-colors'>
              Sisa Rp. {sisa.toLocaleString("id-ID")}
            </CardDescription>
            {/* <div className='flex items-center gap-2 text-xs text-emerald-600'> */}
            {/* <div className='p-3 rounded-full bg-emerald-100'>IDR</div> */}
            {/* <span>Total pemasukan bulan ini</span> */}
            {/* </div> */}
          </div>
        </CardContent>
      </Card>

      {data.map((item, index) => {
        const percentage = ((item.value / item.limit) * 100).toFixed(0);

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
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label
                          htmlFor={`amount-${index}`}
                          className='text-right'>
                          Jumlah
                        </Label>
                        <Input
                          id={`amount-${index}`}
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
                      className={`bg-gradient-to-l from-${item.color}-600 to-${item.color}-100 h-2 rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
