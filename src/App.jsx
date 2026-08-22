import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import FeaturedWedding from "./components/FeaturedWedding.jsx";
import Process from "./components/Process.jsx";
import Gallery from "./components/Gallery.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Contact from "./components/Contact.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <FeaturedWedding />
        <Process />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
