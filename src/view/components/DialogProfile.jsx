import React, { useState, useEffect } from "react";
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
export default function DialogProfile({ getProfilResiko }) {
  const [open, setOpen] = useState(false);

  // Pemicu dialog saat komponen pertama kali dirender
  useEffect(() => {
    if (getProfilResiko === null) {
      setOpen(true);
    }
  }, [getProfilResiko]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      {/* DialogTrigger diperlukan, tapi bisa disembunyikan */}
      <DialogTrigger asChild>
        <button
          type='button'
          className='hidden'>
          Trigger
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-3'>
              <Label htmlFor='name-1'>Name</Label>
              <Input
                id='name-1'
                name='name'
                defaultValue='Pedro Duarte'
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='username-1'>Username</Label>
              <Input
                id='username-1'
                name='username'
                defaultValue='@peduarte'
              />
            </div>
          </div>
          <DialogFooter className='flex justify-end gap-2 mt-4'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
