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
import { Button } from "@/view/components/ui/button";
import PropTypes from "prop-types";

export default function ModalDelete({ isOpen, onClose, onConfirm, data }) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus {data.category}?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={onClose}
              className={"cursor-pointer"}>
              Batal
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              onConfirm(data.id);
              onClose();
            }}
            variant='destructive'
            className={"cursor-pointer"}>
            Hapus Permanen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
ModalDelete.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
};
