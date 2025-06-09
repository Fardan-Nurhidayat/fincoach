import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { ChevronDownIcon } from "@radix-ui/react-icons"; // Example icon, you might need to install @radix-ui/react-icons
import { Link } from "react-router";
import { api } from "@/utils/api";

const DashboardSidebar = () => {
  // Placeholder for dropdown state
  const [profile, setProfile] = useState({});
  const [isYieldsOpen, setIsYieldsOpen] = useState(false);
  const [investasiOpen, setIsInvestasiOpen] = useState(false);
  const [isDexesOpen, setIsDexesOpen] = useState(false);
  const getProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      setProfile(response);
      return response;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <aside className="w-64 bg-gradient-to-r from-purple-800 to-purple-600 text-white flex flex-col p-4">
      {/* Logo Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          {/* Placeholder Logo */}
          <div className="size-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-200" />
          <span className="text-xl font-bold">FinCoach</span>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex flex-col items-center gap-y-3 my-6">
        {/* Placeholder Avatar */}
        <div className="w-10 h-10 bg-white rounded-full">
          <img
            src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
            alt="User Avatar"
            className="w-full h-full rounded-full"
          />
        </div>
        <div>
          <p className="font-semibold">{profile.displayName}</p>
        </div>
      </div>

      <Separator className="bg-white my-4" />

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2 flex-1">
        {/* Dashboard - menggunakan Link langsung */}
        <Link
          to="/dashboard"
          className="flex items-center justify-start text-white hover:bg-white hover:text-purple-700 px-3 py-2 font-semibold rounded-lg cursor-pointer transition-colors"
        >
          <span className="mr-2">📊</span> Dashboard
        </Link>

        {/* Pemasukan - menggunakan Link langsung */}
        <Link
          to="/pemasukan"
          className="flex items-center justify-start text-white hover:bg-white hover:text-purple-700 px-3 py-2 font-semibold rounded-lg cursor-pointer transition-colors"
        >
          <span className="mr-2">💵</span> Pemasukan
        </Link>

        {/* Pengeluaran - menggunakan Link langsung */}
        <Link
          to="/pengeluaran"
          className="flex items-center justify-start text-white hover:bg-white hover:text-purple-700 px-3 py-2 font-semibold rounded-lg cursor-pointer transition-colors"
        >
          <span className="mr-2">💸</span> Pengeluaran
        </Link>

        {/* Tabungan - menggunakan Link langsung */}
        <Link
          to="/tabungan"
          className="flex items-center justify-start text-white hover:bg-white hover:text-purple-700 px-3 py-2 font-semibold rounded-lg cursor-pointer transition-colors"
        >
          <span className="mr-2">💰</span> Tabungan
        </Link>

        {/* Investasi dengan Dropdown */}
        <div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white w-full flex items-center justify-between"
            onClick={() => setIsInvestasiOpen(!investasiOpen)}
          >
            <span className="flex items-center">
              <span className="mr-5">💸</span> Investasi
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                investasiOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
          {investasiOpen && (
            <div className="ml-6 flex flex-col space-y-1 mt-1">
              {/* Item Dropdown Investasi */}
              <Link
                to="/investasi"
                className="flex items-center justify-start text-gray-300 hover:bg-white text-sm px-3 py-1 rounded-lg cursor-pointer transition-colors"
              >
                Investasi
              </Link>
              <Link
                to="/saham-perusahaan"
                className="flex items-center justify-start text-gray-300 hover:bg-white text-sm px-3 py-1 rounded-lg cursor-pointer transition-colors"
              >
                Saham Perusahaan
              </Link>
            </div>
          )}
        </div>

        {/* Yields dengan Dropdown */}
        <div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white w-full flex items-center justify-between"
            onClick={() => setIsYieldsOpen(!isYieldsOpen)}
          >
            <span className="flex items-center">
              <span className="mr-5">💰</span> Yields
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                isYieldsOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
          {isYieldsOpen && (
            <div className="ml-6 flex flex-col space-y-1 mt-1">
              {/* Item Dropdown Yields */}
              <Link
                to="/yield-farm-1"
                className="flex items-center justify-start text-gray-300 hover:bg-white text-sm px-3 py-1 rounded-lg cursor-pointer transition-colors"
              >
                Yield Farm 1
              </Link>
              <Link
                to="/yield-farm-2"
                className="flex items-center justify-start text-gray-300 hover:bg-white text-sm px-3 py-1 rounded-lg cursor-pointer transition-colors"
              >
                Yield Farm 2
              </Link>
            </div>
          )}
        </div>

        {/* DEXes dengan Dropdown */}
        <div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white w-full flex items-center justify-between"
            onClick={() => setIsDexesOpen(!isDexesOpen)}
          >
            <span className="flex items-center">
              <span className="mr-5">💱</span> DEXes
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                isDexesOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
          {isDexesOpen && (
            <div className="ml-6 flex flex-col space-y-1 mt-1">
              {/* Item Dropdown DEXes */}
              <Link
                to="/dex-1"
                className="flex items-center justify-start text-gray-300 hover:bg-white text-sm px-3 py-1 rounded-lg cursor-pointer transition-colors"
              >
                DEX 1
              </Link>
              <Link
                to="/dex-2"
                className="flex items-center justify-start text-gray-300 hover:bg-white text-sm px-3 py-1 rounded-lg cursor-pointer transition-colors"
              >
                DEX 2
              </Link>
            </div>
          )}
        </div>

        {/* Protocols - menggunakan Link langsung */}
        <Link
          to="/protocols"
          className="flex items-center justify-start text-white hover:bg-white px-3 py-2 rounded-lg cursor-pointer transition-colors"
        >
          <span className="mr-2">📜</span> Protocols
        </Link>

        {/* Settings - menggunakan Link langsung */}
        <Link
          to="/settings"
          className="flex items-center justify-start text-white hover:bg-white px-3 py-2 rounded-lg cursor-pointer transition-colors"
        >
          <span className="mr-2">⚙️</span> Settings
        </Link>
      </nav>

      <Separator className="bg-white my-4" />

      {/* Log Out Button */}
      <Button
        variant="ghost"
        onClick={() => {
          localStorage.removeItem("fincoach_token");
          window.location.href = "/login";
        }}
        className="justify-start text-white hover:bg-white cursor-pointer transition-colors"
      >
        <span className="mr-2">➡️</span> Log out
      </Button>
    </aside>
  );
};

export default DashboardSidebar;
