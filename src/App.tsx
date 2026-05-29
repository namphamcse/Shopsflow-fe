import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
