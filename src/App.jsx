import "./index.css";
import { useState } from "react";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Hero from "./pages/Hero";
import Destiny from "./pages/Destiny";
import About from "./pages/About";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import CTA from "./pages/CTA";
import FAQ from "./pages/FAQ";
import Strip from "./pages/Strip";
import PainPoint from "./pages/PainPoint";
import PopUp from "./pages/PopUp";

function App() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Header onBookNow={() => setShowPopup(true)} />
      <main>
        <Hero onBookNow={() => setShowPopup(true)} />
        <Destiny />
        <Strip />
        <PainPoint />
        <About />
        <Services onBookNow={() => setShowPopup(true)} />
        <Testimonials />
        <CTA onBookNow={() => setShowPopup(true)} />
        <FAQ />
      </main>
      <Footer />
      {/* Sirf ek popup — poori app ke liye */}
      <PopUp isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
export default App;