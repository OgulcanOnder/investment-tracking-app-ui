import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import ExchangeCard from "./components/ExchangeCard";
import ForgotPasswordPage from "./components/ForgotPassword";
import Header from "./components/Header";
import Investment from "./components/Investment";
import LoginPage from "./components/Login";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./components/Register";
import ResetPasswordPage from "./components/ResetPassword";
import { setNavigator } from "./navigationService";

const NavigatorSetter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);
  return null;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <NavigatorSetter />
        <Header />
        <Routes>
          <Route
            path="/"
            element={<ExchangeCard />}
          />
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="/reset-password"
            element={<ResetPasswordPage />}
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/investment"
              element={<Investment />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>
          <Route
            path="*"
            element={<div>Sayfa Bulunamadı</div>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
