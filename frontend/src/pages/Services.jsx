import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Services.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../components/Footer';
import MobileFooter from '../components/MobileFooter';
import Header from '../components/Header';

const handleButtonRipple = (e) => {
  const button = e.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
  circle.classList.add('ripple');
  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) ripple.remove();
  button.appendChild(circle);
};

const handleCardMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * 8;
  const rotateY = ((x - centerX) / centerX) * 8;
  card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
};

const handleCardMouseLeave = (e) => {
  e.currentTarget.style.transform = '';
};

const Services = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const handleServiceClick = (serviceType) => {
    navigate(`/job-request?service=${serviceType}`);
  };

  return (
    <>
      <Header />
      <div className="page-wrapper" style={{ paddingBottom: '80px' }}>
        {/* Services Content */}
        <div className="services-container">
          <div className="services-header" data-aos="fade-right" data-aos-delay="100">
            <h1>Our Services</h1>
            <p>Professional home cleaning and maintenance services to keep your space pristine and functional.</p>
          </div>
          
          {/* SVG divider after header */}
          <svg className="section-divider" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f9fbfd" d="M0,80 C480,0 960,160 1440,80 L1440,160 L0,160 Z"/>
          </svg>
          
          <div className="services-grid">
            {/* All Services in Horizontal Grid */}
            <div className="precise-services-row">
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="100" 
                   onClick={() => handleServiceClick('maid')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-broom"></i>
                </div>
                Maid Service
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="150" 
                   onClick={() => handleServiceClick('deep-cleaning')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-spray-can"></i>
                </div>
                Deep Cleaning
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="200" 
                   onClick={() => handleServiceClick('plumbing')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-wrench"></i>
                </div>
                Plumbing
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="250" 
                   onClick={() => handleServiceClick('electrical')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                Electrical
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="300" 
                   onClick={() => handleServiceClick('kitchen-cleaning')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-utensils"></i>
                </div>
                Kitchen Cleaning
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="350" 
                   onClick={() => handleServiceClick('ac-installation')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-snowflake"></i>
                </div>
                AC Installation
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="400" 
                   onClick={() => handleServiceClick('leakage-repair')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-tint"></i>
                </div>
                Leakage Repair
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="450" 
                   onClick={() => handleServiceClick('sofa-cleaning')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-couch"></i>
                </div>
                Sofa Cleaning
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="500" 
                   onClick={() => handleServiceClick('carpet-shampoo')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-rug"></i>
                </div>
                Carpet Shampoo
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="550" 
                   onClick={() => handleServiceClick('fan-servicing')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-fan"></i>
                </div>
                Fan Servicing
              </div>
              
              <div className="precise-service-card" data-aos="zoom-in" data-aos-delay="600" 
                   onClick={() => handleServiceClick('window-cleaning')} 
                   onMouseMove={handleCardMouseMove} 
                   onMouseLeave={handleCardMouseLeave}>
                <div className="precise-service-icon">
                  <i className="fas fa-window-maximize"></i>
                </div>
                Window Cleaning
              </div>
            </div>

            {/* More Services Card */}
            <div className="service-card more-services" data-aos="fade-up" data-aos-delay="650">
              <h3>Need Another Service?</h3>
              <p>Tell us what you need - we're here to help!</p>
              <Link to="/job-request" className="call-us-btn" onClick={handleButtonRipple}>Book Now</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <MobileFooter />
    </>
  );
};

export default Services;