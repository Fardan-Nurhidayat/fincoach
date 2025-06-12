import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fiturList = [
  {
    title: "Smart Budget Allocation",
    desc: "Otomatis membagi pendapatan bulanan dengan prinsip 50/30/20 untuk kebutuhan, tabungan, dan investasi.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
      />
    ),
  },
  {
    title: "Investment Recommendation",
    desc: "Saran investasi berbasis profil risiko dan tren pasar simulatif.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
      />
    ),
  },
  {
    title: "Expense Tracking",
    desc: "Input pengeluaran harian berdasarkan kategori untuk membandingkan dengan anggaran ideal.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
      />
    ),
  },
  {
    title: "Financial Dashboard",
    desc: "Visualisasi data anggaran dan pengeluaran dalam grafik interaktif.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  {
    title: "AI-Driven Insights",
    desc: "Menggunakan model sederhana (TensorFlow) untuk mendukung keputusan keuangan pengguna.",
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
];

export default function Fitur() {
  const firstRow = fiturList.slice(0, 3);
  const secondRow = fiturList.slice(3);

  return (
    <section
      id="fitur"
      className="text-gray-700 body-font bg-gradient-to-b from-white to-purple-50 py-24"
    >
      <div className="container px-5 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h1 className="sm:text-4xl text-3xl font-bold title-font text-gray-900 mb-4">
            Fitur Unggulan Kami
          </h1>
          <p className="lg:w-2/3 w-full leading-relaxed text-gray-500">
            Berbagai fitur inovatif untuk membantu pengelolaan keuangan Anda
            secara cerdas dan mudah.
          </p>
        </motion.div>

        <div className="hidden lg:grid grid-cols-3 gap-8 justify-center w-full mb-8">
          {firstRow.map((fitur, idx) => (
            <FeatureCard key={idx} fitur={fitur} index={idx} />
          ))}
        </div>

        <div className="hidden md:grid grid-cols-2 gap-8 w-full justify-center  max-w-4xl mx-auto mb-8">
          {secondRow.map((fitur, idx) => (
            <FeatureCard key={idx} fitur={fitur} index={idx + 3} />
          ))}
        </div>

        <div className="grid md:hidden grid-cols-1 gap-8 w-full">
          {fiturList.map((fitur, idx) => (
            <FeatureCard key={idx} fitur={fitur} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Komponen FeatureCard terpisah agar reusable
function FeatureCard({ fitur, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
        transition: {
          scale: { duration: 0.2 },
          boxShadow: { duration: 0.3 },
        },
      }}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all duration-300 ease-in-out"
    >
      <div className="w-12 h-12 inline-flex items-center justify-center rounded-lg bg-gray-100 text-purple-400 mb-5">
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="w-7 h-7"
        >
          {fitur.icon}
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {fitur.title}
      </h2>
      <p className="leading-relaxed text-gray-600">{fitur.desc}</p>
    </motion.div>
  );
}
