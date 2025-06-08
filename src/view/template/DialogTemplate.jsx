import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/view/components/ui/dialog";
import { Input } from "@/view/components/ui/input";
import { Label } from "@/view/components/ui/label";
import { Button } from "@/view/components/ui/button";

export default function DialogTemplate({
  trigger,
  title,
  description,
  fields,
  initialData = {},
  onSubmit,
  submitText = "Simpan",
  cancelText = "Batal",
  variant = "default", // default, destructive, success
}) {
  const getButtonStyle = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-500 hover:bg-red-600";
      case "success":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };
  const [formData, setFormData] = useState(initialData);
  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px] rounded-xl border-gray-200 shadow-xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-gray-800'>
            {title}
          </DialogTitle>
          <DialogDescription className='text-gray-500'>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={e => onSubmit(e)}>
          <div className='grid gap-4 py-4'>
            {fields.map(field => (
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
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  className='col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            ))}
          </div>
          <DialogFooter className='flex justify-end gap-2'>
            <DialogClose asChild>
              <Button
                variant='outline'
                className='border-gray-300 hover:bg-gray-100'>
                {cancelText}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type='submit'
                className={`text-white ${getButtonStyle()}`}>
                {submitText}
              </Button>
            </DialogClose>
          </DialogFooter>
          <Input
            id='idPengeluaran'
            name='idPengeluaran'
            type='hidden'
            value={formData.id}
            onChange={handleChange}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
