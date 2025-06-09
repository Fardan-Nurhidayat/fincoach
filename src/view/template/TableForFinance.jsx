import { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/view/components/ui/table";
import DialogTemplate from "./DialogTemplate";
import ModalDelete from "./ModalDelete";
import { Button } from "@/view/components/ui/button";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Gunakan ikon dari react-icons

export default function TableTemplate({
  data,
  jenis,
  submitHandler,
  getDetailData,
  deleteHandler,
}) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const jenisConfig = {
    expenses: {
      label: "pengeluaran",
      alasan: "category",
      placeholder: "Makanan , Tagihan , dll",
    },
    investments: {
      label: "investasi",
      alasan: "instrumen",
      placeholder: "Saham , Obligasi , dll",
    },
    income: {
      label: "pemasukan",
      alasan: "source",
      placeholder: "Gaji , Penjualan , dll",
    },
    savings: {
      label: "tabungan",
      alasan: "goal",
      placeholder: "Dana Darurat , Simpanan , dll",
    },
  };
  const { label: jenisData, alasan, placeholder } = jenisConfig[jenis] || {};
  const [editData, setEditData] = useState({});
  const handleEditClick = async itemId => {
    try {
      const data = await getDetailData({
        path: `/${jenis}`,
        id: itemId,
        name: jenisData,
      });
      setEditData(data);
    } catch (err) {
      console.error("Gagal ambil detail data", err);
    }
  };
  const handleDeleteClick = item => {
    setSelectedData(item);
    setOpenDeleteModal(true);
  };
  return (
    <div className='overflow-x-auto mt-5 rounded-lg shadow-md border border-gray-200'>
      <Table>
        <TableHeader className='bg-gradient-to-r from-purple-400 to-purple-500 text-white'>
          <TableRow>
            <TableHead className='px-6 py-4 text-sm text-white font-semibold'>
              No
            </TableHead>
            <TableHead className='px-6 py-4 text-sm text-white font-semibold'>
              Tanggal
            </TableHead>
            <TableHead className='px-6 py-4 text-sm text-white font-semibold'>
              Jumlah
            </TableHead>
            <TableHead className='px-6 py-4 text-sm text-white font-semibold'>
              Kategori
            </TableHead>
            <TableHead className='px-6 py-4 text-sm text-white font-semibold text-right'>
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='divide-y divide-gray-200 bg-white'>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className='text-center py-8 text-gray-500'>
                Tidak ada data ditemukan
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={item.id}
                className='hover:bg-gray-50 transition-colors duration-150'>
                <TableCell className='px-6 py-4 text-gray-800'>
                  {index + 1}
                </TableCell>
                <TableCell className='px-6 py-4 text-gray-800'>
                  {new Date(item.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className='px-6 py-4 text-gray-800 font-medium'>
                  Rp {item[jenis]?.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className='px-6 py-4 text-gray-800'>
                  <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                    {item[alasan] || "Umum"}
                  </span>
                </TableCell>
                <TableCell className='px-6 py-4 flex justify-end gap-2'>
                  <DialogTemplate
                    key={item.id}
                    tipe={jenis}
                    trigger={
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditClick(item.id)}
                        className='text-blue-600 border-blue-300 hover:bg-blue-50 cursor-pointer'>
                        <FaEdit className='mr-1' /> Edit
                      </Button>
                    }
                    title={`Edit ${jenisData}`}
                    description={`Ubah informasi ${jenisData}`}
                    fields={[
                      {
                        label: "Jumlah",
                        id: jenis,
                        placeholder: "Masukkan Jumlah",
                        type: "number",
                      },
                      {
                        label: "Kategori",
                        id: alasan,
                        placeholder: placeholder,
                        type: "text",
                      },
                    ]}
                    onSubmit={submitHandler}
                    submitText='Update Pengeluaran'
                    cancelText='Batal'
                    initialData={editData}
                    variant='destructive'></DialogTemplate>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-red-600 border-red-300 hover:bg-red-50 cursor-pointer'
                    onClick={() => handleDeleteClick(item)}>
                    <FaTrashAlt className='mr-1' /> Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {selectedData && (
        <ModalDelete
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={deleteHandler} // Gunakan prop deleteHandler yang diteruskan
          data={selectedData}
        />
      )}
    </div>
  );
}

TableTemplate.propTypes = {
  data: PropTypes.array.isRequired,
  jenis: PropTypes.string.isRequired,
  submitHandler: PropTypes.func.isRequired,
  getDetailData: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
};
