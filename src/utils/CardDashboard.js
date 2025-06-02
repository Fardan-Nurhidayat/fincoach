let profilResiko = {
  nama: "Moderate",
  deskripsi: "Risiko sedang, perlu perhatian lebih.",
  pengeluaran: 50,
  tabungan: 30,
  investasi: 20,
};

let pemasukan = {
  jumlah: 1000000,
  sumber: "Gaji Bulanan",
};

let pengeluaran = {
  jumlah: 200000,
  limit: (profilResiko.pengeluaran / 100) * pemasukan.jumlah,
};

let tabungan = {
  jumlah: 100000,
  limit: (profilResiko.tabungan / 100) * pemasukan.jumlah,
};

let investasi = {
  jumlah: 100000,
  limit: (profilResiko.investasi / 100) * pemasukan.jumlah,
};

export { profilResiko, pemasukan, pengeluaran, tabungan, investasi };
