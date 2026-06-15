import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import LandingHr from './pages/LandingHr';
import LandingPl from './pages/LandingPl';
import CreateEvent from './pages/CreateEvent';
import CreateEventHr from './pages/CreateEventHr';
import CreateEventPl from './pages/CreateEventPl';
import GuestView from './pages/GuestView';
import GuestViewHr from './pages/GuestViewHr';
import GuestViewPl from './pages/GuestViewPl';
import Dashboard from './pages/Dashboard';
import DashboardHr from './pages/DashboardHr';
import DashboardPl from './pages/DashboardPl';
import Login from './pages/Login';
import LoginHr from './pages/LoginHr';
import LoginPl from './pages/LoginPl';
import Admin from './pages/Admin';
import EmailTest from './pages/EmailTest';
import Terms from './pages/Terms';
import TermsHr from './pages/TermsHr';
import TermsPl from './pages/TermsPl';
import Privacy from './pages/Privacy';
import PrivacyHr from './pages/PrivacyHr';
import PrivacyPl from './pages/PrivacyPl';
import Cookies from './pages/Cookies';
import CookiesHr from './pages/CookiesHr';
import CookiesPl from './pages/CookiesPl';
import { AuthProvider } from './components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const isHr = window.location.hostname.includes('hr.getkliksy.com');
  const isPl = window.location.hostname.includes('pl.getkliksy.com');

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isPl ? <LandingPl /> : isHr ? <LandingHr /> : <Landing />} />
            <Route path="/create" element={isPl ? <CreateEventPl /> : isHr ? <CreateEventHr /> : <CreateEvent />} />
            <Route path="/event/:id" element={isPl ? <GuestViewPl /> : isHr ? <GuestViewHr /> : <GuestView />} />
            <Route path="/dashboard" element={isPl ? <DashboardPl /> : isHr ? <DashboardHr /> : <Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={isPl ? <LoginPl /> : isHr ? <LoginHr /> : <Login />} />
            <Route path="/email-test" element={<EmailTest />} />
            <Route path="/pogoji-uporabe" element={isPl ? <TermsPl /> : isHr ? <TermsHr /> : <Terms />} />
            <Route path="/zasebnost" element={isPl ? <PrivacyPl /> : isHr ? <PrivacyHr /> : <Privacy />} />
            <Route path="/piskotki" element={isPl ? <CookiesPl /> : isHr ? <CookiesHr /> : <Cookies />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
