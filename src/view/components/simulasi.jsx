import React, { useState } from "react";
import { motion } from "framer-motion";

const Simulasi = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(5000000);
  const [riskProfile, setRiskProfile] = useState("low");
  const [showResults, setShowResults] = useState(false);

  // Alokasi berdasarkan profil risiko
  const allocations = {
    low: { expense: 0.5, saving: 0.3, investment: 0.2 },
    medium: { expense: 0.5, saving: 0.2, investment: 0.3 },
    high: { expense: 0.4, saving: 0.2, investment: 0.4 },
  };

  const selectedAllocation = allocations[riskProfile];

  const simulate = () => {
    if (monthlyIncome <= 0) return;
    setShowResults(true);
  };

  const expenses = monthlyIncome * selectedAllocation.expense;
  const savings = monthlyIncome * selectedAllocation.saving;
  const investment = monthlyIncome * selectedAllocation.investment;

  const simulationCards = [
    {
      title: "Pengeluaran",
      description: "Dana yang dapat Anda gunakan untuk keseharian sebesar",
      percentage: `${selectedAllocation.expense * 100}%`,
      amount: expenses,
      color: "red",
    },
    {
      title: "Tabungan",
      description: "Dana yang dapat Anda gunakan untuk menabung sebesar",
      percentage: `${selectedAllocation.saving * 100}%`,
      amount: savings,
      color: "blue",
    },
    {
      title: "Investasi",
      description: "Dana yang dapat Anda gunakan untuk investasi sebesar",
      percentage: `${selectedAllocation.investment * 100}%`,
      amount: investment,
      color: "purple",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-purple-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Simulasi Keuangan Bulanan
          </h1>
          <p className="text-lg text-center mb-12 text-gray-600">
            Masukkan pemasukan bulanan untuk melihat alokasi keuangan Anda.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Form Input */}
          <div className="md:w-1/2 w-full bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Masukkan Pemasukan</h2>
            <div className="mb-4">
              <label htmlFor="income" className="block font-medium mb-2">
                Pemasukan Bulanan
              </label>
              <input
                id="income"
                type="number"
                min="0"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-purple-500 transition duration-300"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="riskProfile" className="block font-medium mb-2">
                Profil Risiko
              </label>
              <select
                id="riskProfile"
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-purple-500 transition duration-300"
              >
                <option value="low">
                  Rendah (50% Pengeluaran, 30% Tabungan, 20% Investasi)
                </option>
                <option value="medium">
                  Sedang (50% Pengeluaran, 20% Tabungan, 30% Investasi)
                </option>
                <option value="high">
                  Tinggi (40% Pengeluaran, 20% Tabungan, 40% Investasi)
                </option>
              </select>
            </div>

            <button
              onClick={simulate}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition duration-300"
            >
              Simulasikan
            </button>
          </div>

          {/* Hasil Simulasi */}
          {showResults && (
            <div className="md:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {simulationCards.map((item, index) => (
                <SimulationCard key={index} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component Kartu Simulasi
const SimulationCard = ({ item, index }) => {
  const colors = {
    red: {
      textMain: "text-red-700",
      textBold: "text-red-800",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    blue: {
      textMain: "text-blue-700",
      textBold: "text-blue-800",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    purple: {
      textMain: "text-purple-700",
      textBold: "text-purple-800",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
  };

  const selectedColor = colors[item.color];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: 0.1 + index * 0.1,
      }}
      className={`${selectedColor.bg} border ${selectedColor.border} p-5 rounded-lg shadow-sm hover:shadow-lg transition duration-300`}
    >
      <h2 className={`font-semibold text-xl ${selectedColor.textMain} mb-4`}>
        {item.title}
      </h2>
      <p className="text-gray-600 mb-2">
        {item.description}
        <span className={`font-bold ${selectedColor.textBold}`}>
          {" "}
          {item.percentage}
        </span>{" "}
        dari pemasukan Anda atau setara dengan
      </p>
      <p className={`text-xl font-semibold ${selectedColor.textMain}`}>
        Rp{Math.round(item.amount).toLocaleString()}
      </p>
    </motion.div>
  );
};

export default Simulasi;
