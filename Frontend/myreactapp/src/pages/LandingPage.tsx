import Header from './LandingPageComponents/Header/Header';
import Hero from './LandingPageComponents/Hero/Hero';
import Features from './LandingPageComponents/Features/Features';
import HowItWorks from './LandingPageComponents/HowItWorks/HowItWorks';
import About from './LandingPageComponents/About/About';
import Footer from './LandingPageComponents/Footer/Footer';
import '../styles/animations.css';

const LandingPage = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="py-20"></div>
        <Features />
        <div className="py-20"></div>
        <HowItWorks />
        <div className="py-20"></div>
        <About />
        <div className="py-20"></div>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
