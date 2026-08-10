import { useEffect, useState } from "react";
import { Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ExchangeCard from "./components/ExchangeCard";
import ForgotPasswordPage from "./components/ForgotPassword";
import Header from "./components/Header";
import Investment from "./components/Investment";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import ResetPasswordPage from "./components/ResetPassword";
import { history } from "./history";

function App() {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useEffect(() => {
    const unlisten = history.listen(setState);
    return unlisten;
  }, []);
  return (
    <>
      <Router
        location={state.location}
        navigator={history}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={<ExchangeCard />}
          />
          <Route
            path="/investment"
            element={<Investment />}
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
