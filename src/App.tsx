import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ExchangeCard from "./components/ExchangeCard";
import Header from "./components/Header";
import Investment from "./components/Investment";

function App() {
  return (
    <>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
