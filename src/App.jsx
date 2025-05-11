import "./styles/style.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Welcome from "./view/pages/Welcome";
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path='/'
        element={<Welcome />}
      />
    </Routes>
  </BrowserRouter>
);

export default App;
