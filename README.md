# 💰 FinCoach – Smart Financial Guidance App

FinCoach adalah aplikasi berbasis web yang membantu pengguna dalam mengelola keuangan pribadi dengan cerdas melalui alokasi anggaran otomatis, pelacakan pengeluaran, dan rekomendasi investasi yang didukung AI serta literasi keuangan interaktif.

## 🚀 Fitur Utama

- 🔢 **Smart Budget Allocation**: Otomatis membagi pendapatan bulanan tergantung profil resiko dengan membagi menjadi kebutuhan, tabungan, dan investasi.
- 📈 **Investment Prediction**: Prediksi Harga saham oleh AI.
- 🧮 **Expense,Savings and Investment Tracking**: Input pengeluaran , tabungan dan investasi harian
- 📊 **Financial Dashboard**: Visualisasi data anggaran dan pengeluaran dalam grafik interaktif.
- 🧠 **AI-Driven Insights**: Menggunakan model sederhana (TensorFlow) untuk mendukung keputusan investasi pengguna.

## 🛠️ Tech Stack

- **Frontend**: [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **ML**: [Tensorflow](https://www.tensorflow.org/), [yfinance](https://ranaroussi.github.io/yfinance/), [FastApi](https://fastapi.tiangolo.com/)
- **Build Tools**: JavaScript, HTML5, CSS3, Docker

## 📂 Struktur Proyek

```
fincoach/
├── public/
├── src/
    └── App.jsx
    └── firebase.js
    └── main.jsx
    ├── assets/
    ├── hooks/
    ├── lib/
    ├── styles/
    └── style.css
    ├── utils/
    ├── view/
        ├── components/
        ├── pages/
        ├── template/

├── eslint.config.js
├── index.html
└── package.json
```

## ⚙️ Cara Instalasi

1. **Clone repository ini**

```bash
git clone https://github.com/Fardan-Nurhidayat/fincoach.git
cd fincoach
```

2. **Install dependencies**

```bash
npm install
```

3. **Jalankan development server**

```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173` secara default.

## 🤝 How to Contribute

1. **Buat branch baru**

```bash
git branch -M <nama-branch>
```

2. **Deploy perubahan mu**

```bash
git add .
git commit -m "Commit Message"
git push -u origin <nama-branch>
```

## 👥 Contributors

- [Fardan Nurhidayat](https://github.com/Fardan-Nurhidayat)
- [Nafis Watsiq](https://github.com/nafiswatsiq)
- Puput
- [Wilbert Neilson Sachio](https://github.com/WilbertNeilsonSachio)
- [Rio Octaviannus Loka](https://github.com/RioOctaviannusLoka)
- [Satyavira Prathama](https://github.com/Satyavira)

## 🔗 Repository

👉 [GitHub Link – FinCoach](https://github.com/Fardan-Nurhidayat/fincoach)

## 📌 Catatan Pengembangan

- Proyek ini dikembangkan sebagai bagian dari Capstone Project Coding Camp DBS Foundation.

---
