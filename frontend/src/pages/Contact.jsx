import React, { useState } from 'react';
import './Contact.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- SVG Icons (reused and adapted) ---
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const AddressIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);


export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNewsletterChange = (e) => {
        setNewsletterEmail(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // You can add your form submission logic here (e.g., API call)
        console.log('Form data submitted:', formData);
        alert('Thank you for your message! We will get back to you shortly.');
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // You can add your newsletter signup logic here
        console.log('Newsletter signup:', newsletterEmail);
        alert('Thank you for subscribing to our newsletter!');
        setNewsletterEmail('');
    };

    return (
        <>
            <Header />
            <div className="contact-page-container" style={{ paddingTop: '60px' }}>
                <header className="contact-header">
                    <div className="contact-header-content">
                        <h1>Contact Us</h1>
                        <p>We're here to help. Send us a message and we'll get back to you as soon as possible.</p>
                    </div>
                </header>

                <main className="contact-main-content">
                    <div className="contact-form-section">
                        <form onSubmit={handleFormSubmit} className="contact-form">
                            <div className="contact-form-row">
                                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} required />
                                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleFormChange} required />
                            </div>
                            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleFormChange} required />
                            <textarea name="message" placeholder="Message" value={formData.message} onChange={handleFormChange} rows="5" required></textarea>
                            <button type="submit" className="contact-submit-btn">Submit Button</button>
                        </form>
                    </div>

                    <div className="newsletter-section">
                        <div className="newsletter-box">
                            <h3>Our Newsletters</h3>
                            <p>Stay updated with our latest news and special offers.</p>
                            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                                <input type="email" placeholder="Email" value={newsletterEmail} onChange={handleNewsletterChange} required />
                                <button type="submit" className="newsletter-submit-btn">Submit Button</button>
                            </form>
                        </div>
                    </div>
                </main>

                <section className="contact-info-section">
                    <div className="info-box">
                        <div className="info-box-icon"><PhoneIcon /></div>
                        <h4>+91 987 654 3210</h4>
                        <p>Contact us anytime for support or inquiries.</p>
                    </div>
                    <div className="info-box">
                        <div className="info-box-icon"><EmailIcon /></div>
                        <h4>support@blucollar.in</h4>
                        <p>Send us an email and we'll respond promptly.</p>
                    </div>
                    <div className="info-box">
                        <div className="info-box-icon"><AddressIcon /></div>
                        <h4>Pune Headquarters</h4>
                        <p>123 MG Road, Camp, Pune, Maharashtra 411001</p>
                    </div>
                </section>

                <section className="contact-map-section">
                     <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15132.89125584852!2d73.8652425339239!3d18.51952401940902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06932569e29%3A0x1b32b9ac3f1f7798!2sMG%20Road%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Google Maps Location"
                    ></iframe>
                </section>

                <Footer />
            </div>
        </>
    );
} 