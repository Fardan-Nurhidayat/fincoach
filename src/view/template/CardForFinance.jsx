import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/view/components/ui/dialog";
import { Input } from "@/view/components/ui/input";
import { Label } from "@/view/components/ui/label";
import { Button } from "@/view/components/ui/button";

export default function CardAndModalTemplate({
  title,
  currentTotal,
  limit,
  jenis,
  triggerText,
  formFields,
  onSubmit,
}) {
  const colorClasses = {
    pengeluaran: {
      gradient: "from-red-500 to-red-400",
      text: "text-red-500",
      border: "border-red-300",
      focus: "focus:border-red-500",
    },
    investasi: {
      gradient: "from-green-500 to-green-200",
      text: "text-green-600",
      border: "border-green-300",
      focus: "focus:border-green-500",
    },
    pemasukan: {
      gradient: "from-emerald-500 to-blue-500",
      text: "text-blue-500",
      border: "border-blue-300",
      focus: "focus:border-blue-500",
    },
    tabungan: {
      gradient: "from-emerald-500 to-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-300",
      focus: "focus:border-emerald-500",
    },
  };

  const selectedColor = colorClasses[jenis];

  return (
    <div
      className={`lg:col-span-2 bg-gradient-to-r ${selectedColor.gradient} rounded-xl p-6 shadow-lg transition-all hover:shadow-2xl`}>
      <h2 className='text-white text-xl font-semibold'>{title}</h2>
      <div className='mt-2 text-white text-3xl font-bold flex items-center gap-2'>
        {currentTotal !== undefined ? (
          <>
            {jenis === "pemasukan" ? (
              <> Rp {currentTotal.toLocaleString("id-ID")} </>
            ) : (
              <>
                Rp {currentTotal.toLocaleString("id-ID")}{" "}
                <span className={`${selectedColor.text} text-xl`}>/</span>{" "}
                <span className='text-white text-xl font-normal'>
                  Rp {limit.toLocaleString("id-ID")}
                </span>
              </>
            )}
          </>
        ) : (
          <span className='animate-pulse'>Rp ••••••</span>
        )}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button
            className={`px-4 py-2 mt-4 rounded-lg bg-white font-semibold cursor-pointer ${selectedColor.text} transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
            {triggerText}
          </button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px] rounded-xl border-gray-200 shadow-xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold text-gray-800'>
              Tambah {title}
            </DialogTitle>
            <DialogDescription className='text-gray-500'>
              Masukkan informasi {title.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={e => onSubmit(e)}>
            <div className='grid gap-4 py-4'>
              {formFields.map(field => (
                <div
                  key={field.id}
                  className='grid grid-cols-4 items-center gap-4'>
                  <Label
                    htmlFor={field.id}
                    className='text-right text-gray-700'>
                    {field.label}
                  </Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    className={`col-span-3 border-gray-300 ${selectedColor.focus} ${selectedColor.border}`}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                type='submit'
                className={`bg-gradient-to-r ${selectedColor.gradient} cursor-pointer`}>
                {triggerText}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
