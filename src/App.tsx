import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import CreateEvent from './pages/CreateEvent';
import GuestView from './pages/GuestView';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { AuthProvider } from './components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/event/:id" element={<GuestView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
