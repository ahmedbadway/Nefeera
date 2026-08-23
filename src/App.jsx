import FixedVideoBackdrop from "./components/FixedVideoBackdrop.jsx";
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

/**
 * STACKING CONTRACT: FixedVideoBackdrop (and its pause button), Nav, and
 * WhatsAppFloat are position: fixed. They must stay direct children of this
 * transform-free root — a `transform` or `filter` on any ancestor (a motion
 * wrapper around <main>, for instance) would become their containing block
 * and pin them to the page instead of the viewport.
 *
 * The film sits at z-0; everything that scrolls sits above it at z-10.
 */
export default function App() {
  return (
    <>
      <FixedVideoBackdrop />
      <Nav />
      <main id="main" className="relative z-10">
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
