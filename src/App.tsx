import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import LandingHr from './pages/LandingHr';
import CreateEvent from './pages/CreateEvent';
import CreateEventHr from './pages/CreateEventHr';
import GuestView from './pages/GuestView';
import GuestViewHr from './pages/GuestViewHr';
import Dashboard from './pages/Dashboard';
import DashboardHr from './pages/DashboardHr';
import Login from './pages/Login';
import Admin from './pages/Admin';
import EmailTest from './pages/EmailTest';
import Terms from './pages/Terms';
import TermsHr from './pages/TermsHr';
import Privacy from './pages/Privacy';
import PrivacyHr from './pages/PrivacyHr';
import Cookies from './pages/Cookies';
import CookiesHr from './pages/CookiesHr';
import { AuthProvider } from './components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const isHr = window.location.hostname.includes('hr.getkliksy.com');

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isHr ? <LandingHr /> : <Landing />} />
            <Route path="/create" element={isHr ? <CreateEventHr /> : <CreateEvent />} />
            <Route path="/event/:id" element={isHr ? <GuestViewHr /> : <GuestView />} />
            <Route path="/dashboard" element={isHr ? <DashboardHr /> : <Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/email-test" element={<EmailTest />} />
            <Route path="/pogoji-uporabe" element={isHr ? <TermsHr /> : <Terms />} />
            <Route path="/zasebnost" element={isHr ? <PrivacyHr /> : <Privacy />} />
            <Route path="/piskotki" element={isHr ? <CookiesHr /> : <Cookies />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
