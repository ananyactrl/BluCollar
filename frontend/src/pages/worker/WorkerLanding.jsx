import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../../locales/workerSignup';
import './WorkerLanding.css';
import './WorkerMobile.css';
import maidService from '../../assets/wmremove-transformed.jpeg';
import plumberImage from '../../assets/wmremove-transformed (5).jpeg';
import electricianImage from '../../assets/wmremove-transformed (2).jpeg';
import heroImage1 from '../../assets/DeWatermark.ai_1751696171655.jpeg';
import heroImage2 from '../../assets/DeWatermark.ai_1751696190350.jpeg';
import heroImage3 from '../../assets/wmremove-transformed (6).jpeg';
import cookingImage from '../../assets/wmremove-transformed (1).jpeg';
import WorkerHeader from '../../components/WorkerHeader';
import Footer from '../../components/Footer';
import { useLanguage } from '../../components/LanguageContext';
import { getSocket } from '../../services/socketService'; // adjust path if needed
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_BACKEND_URL || 'https://blucollar-fku9.onrender.com';

const heroImages = [heroImage1, heroImage2, heroImage3];

const WorkerLanding = () => {
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = translations[language];
  const [bookingBanner, setBookingBanner] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const workerUser = JSON.parse(localStorage.getItem('workerUser'));
    if (workerUser?.id) {
      socket.emit('join-room', `worker_${workerUser.id}`);
    }
    socket.on('direct-booking', (data) => {
      setBookingBanner(data.message || 'You have a new booking request!');
      toast.info(data.message || 'You have a new booking request!');
    });
    return () => {
      socket.off('direct-booking');
    };
  }, []);

  return (
    <>
      {bookingBanner && (
        <div style={{background:'#123459',color:'#fff',padding:'1rem',textAlign:'center',position:'fixed',top:0,left:0,right:0,zIndex:1000}}>
          <span>{bookingBanner}</span>
          <button style={{marginLeft:'2rem',background:'none',border:'none',color:'#fff',fontWeight:'bold',fontSize:'1.2rem',cursor:'pointer'}} onClick={()=>setBookingBanner(null)}>&times;</button>
        </div>
      )}
      <WorkerHeader />
      <div style={{ background: 'none', minHeight: '100vh', marginTop: 0, paddingTop: 0 }}>
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
              <div className="worker-landing-buttons">
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

        {/* Why Work With Us Section */}
        <section className="why-work-section">
          <h2 className="why-title">Why Work With Us?</h2>
          <p className="why-subtitle">Join thousands of local service professionals who earn a living helping their community</p>
          <div className="why-features">
            <div className="why-feature-card">
              <div className="why-feature-icon"><span role="img" aria-label="clock">🕒</span></div>
              <h3>Work Your Hours</h3>
              <p>Choose when and where you work. Perfect for part-time or full-time income.</p>
            </div>
            <div className="why-feature-card">
              <div className="why-feature-icon"><span role="img" aria-label="chart">📈</span></div>
              <h3>Regular Work</h3>
              <p>Get consistent job requests from verified customers in your neighborhood.</p>
            </div>
            <div className="why-feature-card">
              <div className="why-feature-icon"><span role="img" aria-label="star">⭐</span></div>
              <h3>Build Your Reputation</h3>
              <p>Earn ratings and reviews to attract more customers and higher-paying jobs.</p>
            </div>
            <div className="why-feature-card">
              <div className="why-feature-icon"><span role="img" aria-label="shield">🛡️</span></div>
              <h3>We Support You</h3>
              <p>Get help with customer issues, payments, and growing your service business.</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="worker-services">
          <h2 className="section-title">{t.services.title}</h2>
          <div className="service-cards">
            <div className="service-card maid">
              <div className="image-container">
                <img src={maidService} alt="Maid" />
                <div className="service-overlay"></div>
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

            <div className="service-card plumbing">
              <div className="image-container">
                <img src={plumberImage} alt="Plumbing" className="service-image" />
                <div className="service-overlay"></div>
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

            <div className="service-card electrical">
              <div className="image-container">
                <img src={electricianImage} alt="Electrical" className="service-image" />
                <div className="service-overlay"></div>
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
            <div className="service-card cooking">
              <div className="image-container">
                <img src={cookingImage} alt="Cook" className="service-image" />
                <div className="service-overlay"></div>
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