import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import { FaUserShield, FaBolt, FaTag, FaCheckCircle, FaTools, FaHandshake, FaChartLine, FaUsers, FaCalendarCheck, FaUserCog, FaTruckMoving, FaCommentDots, FaUser, FaCamera, FaRobot, FaExclamationTriangle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import axios from 'axios';
import Header from '../components/Header';
// Import your images
import cookingImg from '../assets/wmremove-transformed (1).jpeg';
import maidImg from '../assets/wmremove-transformed.jpeg';
import electricianImg from '../assets/wmremove-transformed (2).jpeg';
import plumberImg from '../assets/wmremove-transformed (5).jpeg';
import WorkerMatching from '../components/WorkerMatching';

gsap.registerPlugin(ScrollTrigger);

// Keep your workerCards array
const workerCards = [
  {
    title: "Cook",
    img: cookingImg,
    stats: { label1: "300+ Jobs", label2: "4.8★" }
  },
  {
    title: "Maid",
    img: maidImg,
    stats: { label1: "500+ Jobs", label2: "4.9★" }
  },
  {
    title: "Electrician",
    img: electricianImg,
    stats: { label1: "200+ Jobs", label2: "4.7★" }
  },
  {
    title: "Plumber",
    img: plumberImg,
    stats: { label1: "250+ Jobs", label2: "4.8★" }
  },
  // Duplicate for seamless loop
  {
    title: "Cook",
    img: cookingImg,
    stats: { label1: "300+ Jobs", label2: "4.8★" }
  },
  {
    title: "Maid",
    img: maidImg,
    stats: { label1: "500+ Jobs", label2: "4.9★" }
  },
  {
    title: "Electrician",
    img: electricianImg,
    stats: { label1: "200+ Jobs", label2: "4.7★" }
  },
  {
    title: "Plumber",
    img: plumberImg,
    stats: { label1: "250+ Jobs", label2: "4.8★" }
  }
];

const HomePage = () => {
  const heroImageRef = useRef(null);
  const observerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const workerCardRefs = useRef([]);
  const statsRefs = useRef([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isEmergencyTriggered, setIsEmergencyTriggered] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx(currentIdx => (currentIdx + 1) % workerCards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (heroImageRef.current) {
      heroImageRef.current.onload = () => {
        heroImageRef.current.classList.add('loaded');
      };
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((el) => observerRef.current.observe(el));

    AOS.init({ once: true, duration: 900, easing: 'ease-in-out' });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // GSAP counting animation for stats
  useEffect(() => {
    const statsData = [
      { id: 'customers', start: 9500, end: 10000, suffix: '+' },
      { id: 'workers', start: 400, end: 500, suffix: '+' },
      { id: 'satisfaction', start: 90, end: 98, suffix: '%' },
      { id: 'services', start: 14000, end: 15000, suffix: '+' }
    ];

    statsData.forEach((stat, index) => {
      const target = statsRefs.current[index];
      if (target) {
        gsap.from(target, {
          textContent: stat.start,
          duration: 2,
          ease: "power1.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: target.closest('.stat-box'),
            start: "top 80%",
            end: "bottom top",
            toggleActions: "play none none none",
          },
          onUpdate: function() {
            let displayValue = Math.round(this.targets()[0].textContent);
            if (stat.id === 'satisfaction') {
              target.textContent = displayValue + stat.suffix;
            } else {
              target.textContent = displayValue.toLocaleString() + stat.suffix;
            }
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWorkerSelected = (worker) => {
    setSelectedWorker(worker);
  };

  const handleEmergencyClick = async () => {
    if (isEmergencyTriggered) return;

    setIsEmergencyTriggered(true);
    try {
      const response = await axios.post(`${API}/api/emergency/trigger`, {
        location: user ? { lat: user.latitude, lng: user.longitude } : null,
        userId: user ? user.id : 'guest',
      });
      if (response.data.success) {
        alert('Emergency signal sent! Help is on the way. Please stay safe.');
      } else {
        alert('Failed to send emergency signal. Please try again.');
      }
    } catch (error) {
      console.error('Emergency trigger error:', error);
      alert('Error sending emergency signal. Please try again.');
    } finally {
      setTimeout(() => setIsEmergencyTriggered(false), 5000);
    }
  };

  return (
    <>
      <Header />
    <div className="page-wrapper">
      <div className="home-container">
        {/* Emergency Button */}
        <button
          className={`emergency-button ${isEmergencyTriggered ? 'triggered' : ''}`}
          onClick={handleEmergencyClick}
          disabled={isEmergencyTriggered}
        >
          <FaExclamationTriangle size={24} />
          {isEmergencyTriggered ? 'SOS Sent!' : 'SOS'}
        </button>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-carousel-container">
            {workerCards.map((card, idx) => (
              <img
                key={idx}
                src={card.img}
                alt={card.title}
                className="hero-carousel-image"
                style={{
                  zIndex: workerCards.length - idx,
                  opacity: idx === activeIdx ? 1 : 0,
                  transition: 'opacity 1s ease-in-out'
                }}
              />
            ))}
          </div>
          <div className="hero-content-overlay">
            <h1 className="hero-headline gradient-text">
              Find Trusted Local Help, Instantly.
            </h1>
            <p className="hero-subtext">
              BluCollar connects you with reliable, skilled blue-collar workers for all your home service needs, right in your neighborhood.
            </p>
            <div className="hero-buttons">
              <Link to="/job-request" className="hero-button primary">
                Book Now
              </Link>
              <Link to="/services" className="hero-button secondary">
                Browse Services
              </Link>
            </div>
          </div>
          <div className="scroll-indicator"></div>
        </section>

        {/* AI Worker Matching Section */}
        {activeService && (
          <section className="worker-matching-section">
            <div className="section-container">
              <WorkerMatching 
                serviceType={activeService.type} 
                onWorkerSelected={handleWorkerSelected}
              />
            </div>
          </section>
        )}

        {/* Worker Cards Section */}
        <section className="worker-cards-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Our Expert Professionals</h2>
              <p>Connect with skilled workers in your area</p>
            </div>
            <div className="worker-cards-grid">
              {workerCards.map((card, index) => (
                <div
                  key={card.title}
                  className="worker-card"
                  ref={el => workerCardRefs.current[index] = el}
                >
                  <div className="worker-card-image">
                    <img src={card.img} alt={card.title} />
                    <div className="worker-card-overlay">
                      <button className="book-now-btn">Book Now</button>
                    </div>
                  </div>
                  <div className="worker-card-content">
                    <h3 className="worker-card-title">{card.title}</h3>
                    <div className="worker-card-stats">
                      <span className="stat-item">{card.stats.label1}</span>
                      <span className="stat-item rating">{card.stats.label2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="section-container">
            <div className="section-header">
              <h2>How It Works</h2>
              <p>Simple steps to get your service done</p>
            </div>
            <div className="steps-container">
              {[
                {
                  number: 1,
                  title: "AI Service Detection",
                  description: "Upload a photo or describe your need - our AI instantly identifies the required service.",
                  icon: <FaCamera size={40} color="#123459" />
                },
                {
                  number: 2,
                  title: "Smart Worker Matching",
                  description: "Our AI matches you with the best-suited professional based on skills and ratings.",
                  icon: <FaRobot size={40} color="#123459" />
                },
                {
                  number: 3,
                  title: "Confirm & Track",
                  description: "Approve service and track progress in real-time.",
                  icon: <FaTruckMoving size={40} color="#123459" />
                },
                {
                  number: 4,
                  title: "Rate & Review",
                  description: "Share your experience and help improve our AI matching.",
                  icon: <FaCommentDots size={40} color="#123459" />
                }
              ].map((step, index) => (
                <div className="step-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <div className="step-icon">
                      {step.icon}
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="section-container">
            <div className="section-header">
              <h2>What Our Customers Say</h2>
              <p>Real experiences from our satisfied customers</p>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card" data-aos="fade-up">
                <div className="testimonial-content">
                  <p>"BluCollar made finding a reliable electrician so easy! The service was prompt and professional. Highly recommend their platform."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <FaUser size={24} color="#123459" />
                  </div>
                  <div className="author-info">
                    <h4>Priya Sharma</h4>
                    <p>Homeowner, Delhi</p>
                    <span className="trust-badge">Verified User</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card" data-aos="fade-up" data-aos-delay="100">
                <div className="testimonial-content">
                  <p>"I needed a maid urgently, and BluCollar connected me with someone within minutes. Fantastic service and very trustworthy!"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <FaUser size={24} color="#123459" />
                  </div>
                  <div className="author-info">
                    <h4>Rajesh Kumar</h4>
                    <p>Apartment Manager, Mumbai</p>
                    <span className="trust-badge">Verified User</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
                <div className="testimonial-content">
                  <p>"As a cook, BluCollar has provided me with consistent work opportunities and a great way to connect with clients. It's a game-changer!"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <FaUser size={24} color="#123459" />
                  </div>
                  <div className="author-info">
                    <h4>Anjali Singh</h4>
                    <p>Professional Cook, Bangalore</p>
                    <span className="trust-badge">Verified User</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Our Pricing Plans</h2>
              <p>Simple and transparent pricing for your needs</p>
            </div>
            <div className="pricing-slider">
              <div className="pricing-slider-inner">
                <div className="pricing-card small-card">
                  <h3>Hourly Rate</h3>
                  <p className="price">Rs. 25<span>/hour</span></p>
                  <ul>
                    <li>Flexible booking</li>
                    <li>Basic service coverage</li>
                    <li>Pay as you go</li>
                  </ul>
                  <button className="blue-button" onClick={() => window.location.href='/pricing'}>Choose Plan</button>
                </div>
                <div className="pricing-card small-card">
                  <h3>Daily Rate</h3>
                  <p className="price">Rs. 180<span>/day</span></p>
                  <ul>
                    <li>Full-day service</li>
                    <li>Standard service coverage</li>
                    <li>Ideal for larger tasks</li>
                  </ul>
                  <button className="blue-button" onClick={() => window.location.href='/pricing'}>Choose Plan</button>
                </div>
                <div className="pricing-card small-card">
                  <h3>Subscription</h3>
                  <p className="price">Rs. 450<span>/month</span></p>
                  <ul>
                    <li>Recurring services</li>
                    <li>Premium service coverage</li>
                    <li>Dedicated support</li>
                  </ul>
                  <button className="blue-button" onClick={() => window.location.href='/pricing'}>Choose Plan</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section new-cta-section animate-fade-in">
          <div className="section-container">
            <div className="cta-content animate-fade-in">
              <h2>Ready to Get Started?</h2>
              <p>Join BluCollar today and connect with thousands of service providers or find the perfect job for your skills!</p>
              <div className="cta-buttons">
                <Link to="/job-request" className="blue-button">Post a Job</Link>
                <Link to="/worker-signup" className="white-button">Become a Worker</Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-column">
              <h4>About Us</h4>
              <ul>
                <li><Link to="/about">Our Story</Link></li>
                <li><Link to="/about">Our Team</Link></li>
                <li><Link to="/about">Careers</Link></li>
                <li><Link to="/about">Press</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li><Link to="/services">All Services</Link></li>
                <li><Link to="/job-request?service=maid">Maid Service</Link></li>
                <li><Link to="/job-request?service=plumbing">Plumbing</Link></li>
                <li><Link to="/job-request?service=electrical">Electrical</Link></li>
                <li><Link to="/job-request?service=cooking">Cooking</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/safety">Safety</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
                <li><Link to="/accessibility">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BluCollar. All rights reserved.</p>
          </div>
        </footer>

        {/* Help Chat Bubble */}
        <div className="help-chat-bubble" onClick={() => window.open('mailto:support@servlyn.com')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      </div>
    </div>
    </>
  );
}

export default HomePage;
