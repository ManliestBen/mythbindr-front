import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import AuthThemeSync from './components/AuthThemeSync';
import AuthScreen from './auth/AuthScreen';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Placeholder from './pages/Placeholder';

function Splash() {
  return (
    <div className="grid min-h-screen place-items-center bg-app-bg text-fg-muted">
      <span className="text-sm">Loading…</span>
    </div>
  );
}

function Gate() {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <AuthScreen />;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Placeholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthThemeSync />
        <Gate />
      </AuthProvider>
    </ThemeProvider>
  );
}
