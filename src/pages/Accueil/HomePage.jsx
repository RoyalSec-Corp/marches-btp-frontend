import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TrioFonctionnalites from './components/TrioFonctionnalites';
import SolutionsSection from './components/SolutionsSection';
import ServicesSection from './components/ServicesSection';
import AvantagesSection from './components/AvantagesSection';
import CtaSection from './components/CtaSection';
import TarifsSection from './components/TarifsSection';
import RiskAlertSection from './components/RiskAlertSection';
import TemoignagesSection from './components/TemoignagesSection';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';
import ChatButton from './components/ChatButton';
import BackToTop from './components/BackToTop';
import CookieBanner from './components/CookieBanner';

function HomePage() {
  return (
    <div className="bg-white">
      <Header />
      <HeroSection />
      <TrioFonctionnalites />
      <SolutionsSection />
      <ServicesSection />
      <AvantagesSection />
      <CtaSection />
      <TarifsSection />
      <RiskAlertSection />
      <TemoignagesSection />
      <NewsletterSection />
      <Footer />
      <ChatButton />
      <BackToTop />
      <CookieBanner />
    </div>
  );
}

export default HomePage;
