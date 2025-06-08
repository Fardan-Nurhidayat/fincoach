import "./styles/style.css";
import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./view/components/ProtectedRoute";
import Welcome from "./view/pages/Welcome";
import { LoginForm } from "./view/components/login-form";
import { RegisterForm } from "./view/components/register-form";
import Dashboard from "./view/pages/Dashboard";
import Pengeluaran from "@/view/pages/Pengeluaran";
import Investasi from "./view/pages/Investasi";
import SahamPerusahaan from "./view/pages/SahamPerusahaan";
import Tabungan from "./view/pages/Tabungan";

const App = () => (
  <BrowserRouter>
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
        path='/pengeluaran'
        element={
          <ProtectedRoute>
            <Pengeluaran />
          </ProtectedRoute>
        }></Route>
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
  </BrowserRouter>
);

export default App;
