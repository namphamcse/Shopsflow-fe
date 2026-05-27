import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;
