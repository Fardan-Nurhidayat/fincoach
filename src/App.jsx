import "./styles/style.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Welcome from "./view/pages/Welcome";
import { LoginForm } from "./view/components/login-form";
import { RegisterForm } from "./view/components/register-form";
import Dashboard from "./view/pages/Dashboard";

const App = () => (
  <BrowserRouter>
    <Routes>
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
        path='/dashboard'
        element={<Dashboard />}
      />
    </Routes>
  </BrowserRouter>
);

export default App;
