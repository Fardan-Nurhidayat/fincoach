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
      color: "rose",
    },
    {
      title: "Tabungan",
      value: tabungan.jumlah,
      limit: (profilResiko.tabungan / 100) * pemasukan.jumlah,
      color: "blue",
    },
    {
      title: "Investasi",
      value: investasi.jumlah,
      limit: (profilResiko.investasi / 100) * pemasukan.jumlah,
      color: "purple",
    },
  ];

  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
      {/* Kartu Input Pemasukan */}

      <Card className='border-0 hover:border-emerald-300/50 cursor-pointer hover:-translate-y-2.5 duration-300'>
        <CardHeader>
          <CardTitle className='text-slate-700 group-hover:text-emerald-700 transition-colors duration-300'>
            Input Pemasukan
          </CardTitle>
          <CardDescription className='text-slate-600'>
            {profilResiko.pengeluaran}% / {profilResiko.tabungan}% /{" "}
            {profilResiko.investasi}%
          </CardDescription>
          <CardAction>
            <Dialog>
              <DialogTrigger asChild>
                <button className='p-2 rounded-full bg-emerald-100 cursor-pointer text-emerald-600 hover:bg-emerald-200 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25'>
                  <IconPlus />
                </button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label
                      htmlFor='name'
                      className='text-right'>
                      Name
                    </Label>
                    <Input
                      id='name'
                      value='Pedro Duarte'
                      className='col-span-3'
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label
                      htmlFor='username'
                      className='text-right'>
                      Username
                    </Label>
                    <Input
                      id='username'
                      value='@peduarte'
                      className='col-span-3'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type='submit'>Save changes</Button>
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
            <div className='flex items-center gap-2 text-xs text-emerald-600'>
              <div className='p-3 rounded-full bg-emerald-100'>IDR</div>
              <span>Total pemasukan bulan ini</span>
            </div>
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
              <CardAction>
                <button
                  className={`p-2 cursor-pointer rounded-full bg-${item.color}-100 text-${item.color}-600 hover:bg-${item.color}-200 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-${item.color}-500/25`}>
                  <IconPlus />
                </button>
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
                      className={`bg-gradient-to-r from-${item.color}-500 to-${item.color}-400 h-2 rounded-full transition-all duration-700 ease-out`}
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
