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

const API = import.meta.env.VITE_BACKEND_URL || 'https://blucollar-fku9.onrender.com';

const heroImages = [heroImage1, heroImage2, heroImage3];

const WorkerLanding = () => {
  const [language, setLanguage] = useState('english');
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

        {/* Footer */}
        <footer className="worker-footer">
          <div className="footer-content">
            <div className="footer-links" style={{ marginBottom: '6px', fontSize: '0.97rem', color: '#e0e7ef', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
              <Link to="#">Privacy Policy</Link>
              <span style={{ color: '#e0e7ef' }}>|</span>
              <Link to="#">Terms of Service</Link>
              <span style={{ color: '#e0e7ef' }}>|</span>
              <Link to="#">Contact Us</Link>
            </div>
            <div className="footer-copyright" style={{ fontSize: '0.85rem', color: '#b3cdfa', margin: '2px 0 2px 0', textAlign: 'center' }}>
              © 2025 BluCollar. All rights reserved.
            </div>
            <div className="footer-credit-line" style={{ fontSize: '0.9rem', color: '#e0e7ef', fontWeight: 500, margin: '2px 0 2px 0', textAlign: 'center' }}>
              Developed by <span className="footer-credit-name" style={{ fontWeight: 700, color: '#fff' }}>Ananya Singh</span>
            </div>
            <div className="footer-credit-icons" style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '4px' }}>
              <a href="https://github.com/ananyactrl/BluCollar" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ color: '#e0e7ef', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center' }}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/ananya-singh-028571371/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#e0e7ef', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center' }}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default WorkerLanding; 