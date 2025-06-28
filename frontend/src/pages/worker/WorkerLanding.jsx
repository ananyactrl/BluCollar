import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../../locales/workerSignup';
import './WorkerLanding.css';
import './WorkerMobile.css';
import maidService from '../../assets/wmremove-transformed.jpeg';
import plumberImage from '../../assets/wmremove-transformed (5).jpeg';
import electricianImage from '../../assets/wmremove-transformed (2).jpeg';
import heroImage1 from '../../assets/AdobeStock_431135906_Preview.jpeg';
import heroImage2 from '../../assets/AdobeStock_458508034_Preview.jpeg';
import heroImage3 from '../../assets/AdobeStock_845208776_Preview.jpeg';
import cookingImage from '../../assets/wmremove-transformed (1).jpeg';
import WorkerHeader from '../../components/WorkerHeader';
import Footer from '../../components/Footer';
import { useLanguage } from '../../components/LanguageContext';

const API = import.meta.env.VITE_BACKEND_URL || 'https://blucollar-fku9.onrender.com';

const heroImages = [heroImage1, heroImage2, heroImage3];

const WorkerLanding = () => {
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = translations[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <WorkerHeader />
      <div className="worker-landing-container" style={{ paddingTop: '60px' }}>
        {/* Hero Section */}
        <section
          className="worker-hero"
          style={{
            backgroundImage: `url(${heroImages[currentImageIndex]})`,
            transition: 'background-image 1s ease-in-out' // Smooth transition
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text">
              <div className="title-container">
                <h1>{t.hero.title}</h1>
                <h1 className="service-title">{t.hero.titleHighlight}</h1>
              </div>
              <p className="hero-description">
                {t.hero.description}
              </p>
              <div className="hero-buttons">
                <Link to="/worker/signup" className="hero-button primary-button">
                  {t.hero.getStarted}
                </Link>
                <Link to="/worker/jobs" className="hero-button secondary-button">
                  See Job Requests
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="why-join-section">
          <h2 className="section-title">{t.whyJoinTitle}</h2>
          <div className="benefits-cards">
            <div className="benefit-card">
              <h3 className="benefit-title">{t.benefits.flexibleSchedule.title}</h3>
              <p className="benefit-description">
                {t.benefits.flexibleSchedule.description}
              </p>
            </div>

            <div className="benefit-card">
              <h3 className="benefit-title">{t.benefits.steadyIncome.title}</h3>
              <p className="benefit-description">
                {t.benefits.steadyIncome.description}
              </p>
            </div>

            <div className="benefit-card">
              <h3 className="benefit-title">{t.benefits.professionalGrowth.title}</h3>
              <p className="benefit-description">
                {t.benefits.professionalGrowth.description}
              </p>
            </div>

            <div className="benefit-card">
              <h3 className="benefit-title">{t.benefits.supportSystem.title}</h3>
              <p className="benefit-description">
                {t.benefits.supportSystem.description}
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="worker-services">
          <h2 className="section-title">{t.services.title}</h2>
          <div className="service-cards">
            <div className="service-card">
              <div className="image-container">
                <img src={maidService} alt="Maid" />
              </div>
              <h3>{t.services.maid.title}</h3>
              <p>{t.services.maid.description}</p>
              <Link 
                to="/worker/signup?service=maid" 
                className="service-button primary-button"
              >
                {t.services.registerNow}
              </Link>
            </div>

            <div className="service-card">
              <div className="image-container">
                <img src={plumberImage} alt="Plumbing" className="service-image" />
              </div>
              <h3>{t.services.plumbing.title}</h3>
              <p>{t.services.plumbing.description}</p>
              <Link 
                to="/worker/signup?service=plumbing" 
                className="service-button primary-button"
              >
                {t.services.registerNow}
              </Link>
            </div>

            <div className="service-card">
              <div className="image-container">
                <img src={electricianImage} alt="Electrical" className="service-image" />
              </div>
              <h3>{t.services.electrical.title}</h3>
              <p>{t.services.electrical.description}</p>
              <Link 
                to="/worker/signup?service=electrical" 
                className="service-button primary-button"
              >
                {t.services.registerNow}
              </Link>
            </div>

            {/* Cook card */}
            <div className="service-card">
              <div className="image-container">
                <img src={cookingImage} alt="Cook" className="service-image" />
              </div>
              <h3>{t.services.cooking?.title || 'Cook'}</h3>
              <p>{t.services.cooking?.description || 'Register as a professional cook.'}</p>
              <Link 
                to="/worker/signup?service=cooking" 
                className="service-button primary-button"
              >
                {t.services.registerNow}
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default WorkerLanding; 