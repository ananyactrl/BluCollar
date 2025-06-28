import React from 'react';
import '../index.css';
import Header from '../components/Header';

const About = () => (
  <>
    <Header />
    <div className="page-wrapper" style={{ paddingTop: '60px' }}>
      <div className="home-container">
        <section className="hero-section skillex-fade-in visible" style={{minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="hero-text-container" style={{maxWidth: 700, margin: '0 auto', textAlign: 'center'}}>
            <h1 className="hero-title gradient-text">About BluCollar</h1>
            <p className="hero-description" style={{fontSize: '1.2rem', color: '#123459cc', margin: '1.5rem 0'}}>
              Your trusted partner for seamless, professional home services.
            </p>
          </div>
        </section>
        <section className="features-section skillex-fade-in visible" style={{paddingTop: 0}}>
          <div className="section-container" style={{maxWidth: 800, margin: '0 auto'}}>
            <div className="section-header" style={{marginBottom: 32}}>
              <h2 style={{color: '#123459'}}>Who We Are</h2>
            </div>
            <div style={{fontSize: '1.1rem', color: '#123459b3', lineHeight: 1.7, background: '#fff', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 12px rgba(18,52,89,0.04)'}}>
              <p>BluCollar was founded with a simple mission: to make daily life easier by connecting you with trusted, background-verified professionals for all your home service needs. Whether you need cleaning, plumbing, electrical work, or cooking, our team is dedicated to providing reliable, high-quality service at your convenience.</p>
              <p>We believe in transparency, quick response, and customer satisfaction. Our platform ensures clear pricing, flexible appointments, and a seamless booking experience. Every service provider is carefully vetted, so you can feel confident and secure inviting them into your home.</p>
              <p>At BluCollar, we're more than just a service platform—we're your partner in creating a comfortable, well-maintained home. Thank you for trusting us to serve you!</p>
            </div>
          </div>
        </section>
        <footer className="footer">
          <div className="footer-bottom">
            <div className="footer-credit">
              <span>
                Project by <span className="footer-credit-name">Ananya Singh</span>
              </span>
              <div className="footer-credit-icons">
                <a href="https://github.com/ananyactrl/BluCollar" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/ananya-singh-028571371/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </>
);

export default About; 