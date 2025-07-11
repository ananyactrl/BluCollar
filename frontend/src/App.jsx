import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

import { AuthProvider } from './context/AuthContext';
// Main pages
import HomePage from './pages/HomePage';
import Signup from './Signup';
import Login from './Login';
import Services from './pages/Services';
import JobRequestForm from './JobRequestForm';
import About from './pages/About';
import PricingPage from './pages/PricingPage';
import Contact from './pages/Contact';
import ClientDashboard from './pages/ClientDashboard';
import AccountSettings from './pages/AccountSettings';
import FindWorkers from './pages/FindWorkers';

// Worker related imports
import WorkerSignup from './pages/worker/WorkerSignup';
import WorkerLogin from './pages/worker/WorkerLogin';
import WorkerJobs from './pages/worker/WorkerJobs';
import WorkerLanding from './pages/worker/WorkerLanding';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import AdminPanel from './pages/AdminPanel';
import ApplicationSummary from './pages/worker/ApplicationSummary';

import JobDetails from './jobDetails';
// CSS imports
import './index.css';
import './mobile.css';
import './signup.css';
import './JobRequestForm.css';
import './pages/Services.css';
import './pages/worker/WorkerJobs.css';
import './pages/worker/WorkerLanding.css';
import './WorkerJobs.css';
import './AdminPanel.css';
import './pages/FindWorkers.css';
import './pages/worker/ApplicationSummary.css';
import ProtectedRoute from './components/ProtectedRoute';
import AccountDetails from './pages/worker/AccountDetails';
import MessageChat from './pages/MessageChat';
import CalendarView from './pages/CalendarView';
import Account from './pages/AccountSettings';




// Protected Route Component
const ProtectedRouteComponent = ({ children }) => {
  const isAuthenticated = localStorage.getItem('workerToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/worker/login" replace />;
  }

  return children;
};

function JobDetailsWrapper() {
  const { id } = useParams();
  const [job, setJob] = React.useState(null);
  React.useEffect(() => {
    fetch(`http://localhost:8000/job-request/${id}`)
      .then(res => res.json())
      .then(data => setJob(data));
  }, [id]);
  if (!job) return <div>Loading...</div>;
  return <JobDetails job={job} />;
}

function MessageChatWrapper() {
  const { job_id } = useParams();
  return <MessageChat job_id={job_id} />;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter basename="/">
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/job-request" element={<JobRequestForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/find-workers" element={<FindWorkers />} />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/account-settings" element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } />

          {/* Worker routes */}
          <Route path="/worker" element={<WorkerLanding />} />
          <Route path="/worker/signup" element={<WorkerSignup />} />
          <Route path="/worker/login" element={<WorkerLogin />} />
          <Route path="/worker/application-summary" element={<ApplicationSummary />} />
          
          {/* Protected worker routes */}
          <Route path="/worker/dashboard" element={
            <ProtectedRouteComponent>
              <WorkerDashboard />
            </ProtectedRouteComponent>
          } />
          <Route path="/worker/jobs" element={
            <ProtectedRouteComponent>
              <WorkerJobs />
            </ProtectedRouteComponent>
          } />

          {/* Redirect old paths */}
          <Route path="/worker-signup" element={<Navigate to="/worker/signup" replace />} />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* Worker job details route */}
          <Route path="/worker/job/:id" element={<JobDetailsWrapper />} />

          {/* Worker account details route */}
          <Route path="/worker/account" element={<AccountDetails />} />

          {/* Message chat route */}
          <Route path="/messages/:job_id" element={<MessageChatWrapper />} />

          {/* Calendar view route */}
          <Route path="/calendar-view" element={<CalendarView />} />

          {/* Account route */}
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;