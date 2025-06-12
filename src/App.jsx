import "./styles/style.css";
import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./view/components/ProtectedRoute";
import Welcome from "./view/pages/Welcome";
import { LoginForm } from "./view/components/login-form";
import { RegisterForm } from "./view/components/register-form";
import MaintenancePage from "./view/pages/Maintenance";
import Dashboard from "./view/pages/Dashboard";
import Pengeluaran from "@/view/pages/Pengeluaran";
import Investasi from "./view/pages/Investasi";
import SahamPerusahaan from "./view/pages/SahamPerusahaan";
import Tabungan from "./view/pages/Tabungan";
import Pemasukan from "./view/pages/Pemasukan";
import ConditionalRoute from "./view/components/ConditionalRoute";
import { isMaintenance } from "@/utils/config";
const App = () => (
  <BrowserRouter>
    <ConditionalRoute>
      <Routes>
        {/* Rute Publik */}
        <Route
          path='/'
          element={<Welcome />}
        />
        <Route
          path='/login'
          element={<LoginForm />}
        />
        <Route
          path='/register'
          element={<RegisterForm />}
        />
        <Route
          path='/maintenance'
          element={<MaintenancePage />}
        />

        {/* Rute Terproteksi */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/pemasukan'
          element={
            <ProtectedRoute>
              <Pemasukan />
            </ProtectedRoute>
          }
        />
        <Route
          path='/pengeluaran'
          element={
            <ProtectedRoute>
              <Pengeluaran />
            </ProtectedRoute>
          }
        />
        <Route
          path='/investasi'
          element={
            <ProtectedRoute>
              <Investasi />
            </ProtectedRoute>
          }
        />
        <Route
          path='/saham-perusahaan'
          element={
            <ProtectedRoute>
              <SahamPerusahaan />
            </ProtectedRoute>
          }
        />
        <Route
          path='/tabungan'
          element={
            <ProtectedRoute>
              <Tabungan />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ConditionalRoute>
  </BrowserRouter>
);

export default App;
