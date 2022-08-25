import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Services from "./components/Services";
import Transactions from "./components/Transactions";
import Welcome from "./components/Welcome";

function App() {
  return (
    <div className="min-h-screen w-[100vw]">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  );
}

export default App;
