import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { translations } from '../../locales/workerSignup';
import './WorkerSignup.css';
import './WorkerMobile.css';
import cookingImage from '../../assets/wmremove-transformed (1).jpeg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import WorkerHeader from '../../components/WorkerHeader';

const PROFESSIONS = {
  plumber: {
    title: 'Plumber',
    skills: [
      'Pipe Installation',
      'Leak Repair',
      'Drain Cleaning',
      'Water Heater Installation',
      'Bathroom Fitting',
      'Kitchen Plumbing'
    ],
    certifications: ['Plumbing License', 'Safety Certification', 'Trade Certification']
  },
  electrician: {
    title: 'Electrician',
    skills: [
      'Wiring Installation',
      'Circuit Repair',
      'Electrical Maintenance',
      'Safety Inspection',
      'Emergency Services',
      'Appliance Installation'
    ],
    certifications: ['Electrical License', 'Safety Certification', 'Trade Certification']
  },
  maid: {
    title: 'Maid',
    skills: [
      'House Cleaning',
      'Laundry',
      'Dish Washing',
      'Baby Sitting',
      'Elder Care',
      'Pet Care',
      'Gardening'
    ],
    certifications: ['Maid Certification', 'First Aid Training', 'Food Safety']
  },
  cooking: {
    title: 'Cook',
    skills: [
      'Indian Cuisine',
      'Continental Cuisine',
      'Baking',
      'Meal Prep',
      'Catering',
      'Dietary Meals'
    ],
    certifications: ['Culinary Arts Diploma', 'Food Safety Certification', 'Hygiene Certification']
  }
};

const EXPERIENCE_LEVELS = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  'More than 5 years'
];

function WorkerSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('english');
  const t = translations[language] || {}; // Fallback to empty object
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [worker, setWorker] = useState({
    profession: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    skills: [],
    experience: '',
    description: '',
    certifications: [],
    profilePhoto: null,
    facePhoto: null,
    portfolioFiles: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  // Get initial profession from URL if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get('service');
    if (service && PROFESSIONS[service]) {
      setWorker(prev => ({ ...prev, profession: service }));
      setStep(2);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorker(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfessionSelect = (profession) => {
    setWorker(prev => ({
      ...prev,
      profession,
      skills: []
    }));
    setStep(2);
  };

  const handleSkillToggle = (skill) => {
    setWorker(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleCertificationToggle = (certification) => {
    setWorker(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const handleExperienceChange = (e) => {
    setWorker(prev => ({
      ...prev,
      experience: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setWorker(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handlePortfolioFilesChange = (e) => {
    if (e.target.files) {
      setWorker(prev => ({
        ...prev,
        portfolioFiles: Array.from(e.target.files)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (worker.password !== worker.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!worker.experience) {
      setError('Please select your experience.');
      return;
    }

    // Don't submit here, just navigate to summary
    navigate('/worker/application-summary', { state: { workerData: worker } });
  };

  const renderProfessionSelection = () => (
    <div className="profession-selection" data-aos="fade-up" data-aos-delay="100">
      <div className="signup-header">
        <h1>{t.step1_title || 'Choose Your Profession'}</h1>
        <p>{t.step1_description || 'Select the service you want to provide'}</p>
      </div>
      <div className="profession-cards">
        {Object.entries(PROFESSIONS).map(([key, profession]) => (
          <div
            key={`profession-${key}`} // Fixed: Added unique prefix
            className="profession-card"
            onClick={() => handleProfessionSelect(key)}
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <h3>{profession.title}</h3>
            <p>{t.profession_description || 'Click to select this profession'}</p>
          </div>
        ))}
      </div>
      <div className="button-group">
        <button type="button" className="submit-btn" onClick={() => setStep(2)}>
          {t.next_button || 'Next'}
        </button>
      </div>
    </div>
  );

  const renderSkillsSelection = () => (
    <div className="signup-form-section" data-aos="fade-up">
      <div className="signup-header">
        <h2>{t.step3_title || 'Skills & Experience'}</h2>
        <p>{t.step3_description || 'Select your skills and experience level'}</p>
      </div>
      {error && <p className="error-message">{error}</p>}

      <div className="form-group full-width" style={{ marginBottom: 16 }}>
        <label className="required">{t.experience_label || 'Experience Level'}</label>
        <select name="experience" value={worker.experience} onChange={handleExperienceChange} required>
          <option value="">{t.select_experience_placeholder || 'Select your experience level'}</option>
          {EXPERIENCE_LEVELS.map((level, index) => (
            <option key={`experience-${index}`} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className="form-group full-width" style={{ marginBottom: 16 }}>
        <label className="required">{t.skills_label || 'Skills'}</label>
        <div className="skills-grid">
          {PROFESSIONS[worker.profession]?.skills.map((skill, index) => (
            <button
              key={`skill-${worker.profession}-${index}`} // Fixed: Added unique key with profession and index
              type="button"
              className={`skill-button ${worker.skills.includes(skill) ? 'selected' : ''}`}
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button type="button" className="back-btn" onClick={() => setStep(2)}>
          {t.back_button || 'Back'}
        </button>
        <button type="button" className="submit-btn" onClick={() => setStep(4)}>
          {t.next_button || 'Next'}
        </button>
      </div>
    </div>
  );

  const renderSignupForm = () => (
    <div className="signup-form-section" data-aos="fade-up">
      <div className="signup-header">
        <h2>{t.step2_title || 'Personal Information'}</h2>
        <p>{t.step2_description || 'Please provide your personal details'}</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="form-row signup-form-row">
        <div className="form-group">
          <label className="required">{t.name_label || 'Full Name'}</label>
          <input 
            type="text" 
            name="name" 
            value={worker.name} 
            onChange={handleChange} 
            placeholder={t.name_placeholder || 'Enter your full name'} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="required">{t.email_label || 'Email Address'}</label>
          <input 
            type="email" 
            name="email" 
            value={worker.email} 
            onChange={handleChange} 
            placeholder={t.email_placeholder || 'Enter your email'} 
            required 
          />
        </div>
      </div>
      <div className="form-row signup-form-row">
        <div className="form-group">
          <label className="required">{t.phone_label || 'Phone Number'}</label>
          <input 
            type="tel" 
            name="phone" 
            value={worker.phone} 
            onChange={handleChange} 
            placeholder={t.phone_placeholder || 'Enter your phone number'} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="required">{t.address_label || 'Address'}</label>
          <input 
            type="text" 
            name="address" 
            value={worker.address} 
            onChange={handleChange} 
            placeholder={t.address_placeholder || 'Enter your address'} 
            required 
          />
        </div>
      </div>
      <div className="form-row signup-form-row">
        <div className="form-group" style={{ position: 'relative' }}>
          <label className="required">{t.password_label || 'Password'}</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={worker.password}
            onChange={handleChange}
            placeholder={t.password_placeholder || 'Create a password'}
            required
          />
          <button
            type="button"
            className="eye-icon"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="form-group" style={{ position: 'relative' }}>
          <label className="required">{t.confirm_password_label || 'Confirm Password'}</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={worker.confirmPassword}
            onChange={handleChange}
            placeholder={t.confirm_password_placeholder || 'Confirm your password'}
            required
          />
          <button
            type="button"
            className="eye-icon"
            onClick={() => setShowConfirmPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="form-group full-width">
        <label>{t.description_label || 'Description (Optional)'}</label>
        <textarea 
          name="description" 
          value={worker.description} 
          onChange={handleChange} 
          placeholder={t.description_placeholder || 'Describe your services...'} 
          rows="4"
        ></textarea>
      </div>

      <div className="form-group full-width">
        <label>{t.profile_photo_label || 'Profile Photo (Optional)'}</label>
        <input type="file" name="profilePhoto" accept="image/*" onChange={handleFileChange} />
        {worker.profilePhoto && <p className="file-name">{worker.profilePhoto.name}</p>}
      </div>

      <div className="form-group full-width">
        <label className="required">Face Verification Photo</label>
        <input type="file" name="facePhoto" accept="image/*" onChange={handleFileChange} required />
        {worker.facePhoto && <p className="file-name">{worker.facePhoto.name}</p>}
      </div>

      <div className="form-group full-width">
        <label>{t.portfolio_files_label || 'Portfolio Files (Optional)'}</label>
        <input 
          type="file" 
          name="portfolioFiles" 
          accept="image/*,application/pdf" 
          multiple 
          onChange={handlePortfolioFilesChange} 
        />
        <div className="file-list">
          {worker.portfolioFiles.map((file, index) => (
            <span key={`portfolio-${index}`} className="file-tag">{file.name}</span>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button type="button" className="back-btn" onClick={() => setStep(1)}>
          {t.back_button || 'Back'}
        </button>
        <button type="button" className="submit-btn" onClick={() => setStep(3)}>
          {t.next_button || 'Next'}
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="signup-form-section" data-aos="fade-up">
      <div className="signup-header">
        <h2>{t.step4_title || 'Confirmation'}</h2>
        <p>{t.confirmation_message || 'Please review and submit your application'}</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="button-group">
        <button type="button" className="back-btn" onClick={() => setStep(3)}>
          {t.back_button || 'Back'}
        </button>
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (t.submitting_button || 'Submitting...') : (t.submit_button || 'Submit Application')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <WorkerHeader />
      <div className="worker-signup-container" style={{ paddingTop: '60px' }}>
        <div className="language-toggle">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="marathi">Marathi</option>
          </select>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {step === 1 && renderProfessionSelection()}
          {step === 2 && renderSignupForm()}
          {step === 3 && renderSkillsSelection()}
          {step === 4 && renderConfirmation()}
        </form>
      </div>
    </>
  );
}

export default WorkerSignup;