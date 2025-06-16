import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./Pages/SignUp";
import { ToastContainer } from "react-toastify";
import SignIn from "./Pages/Signin";
import Dashboard from "./Pages/Dashboard";
import SendMoney from "./Pages/SendMoney";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send/:id/:username" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
