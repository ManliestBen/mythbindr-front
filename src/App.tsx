import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { ActiveCampaignProvider } from './campaign/ActiveCampaignProvider';
import AuthThemeSync from './components/AuthThemeSync';
import AuthScreen from './auth/AuthScreen';
import AppShell from './components/AppShell';
import Campaigns from './pages/Campaigns';
import CampaignHome from './pages/CampaignHome';
import ElementList from './pages/ElementList';
import ElementEditor from './pages/ElementEditor';
import SearchResults from './pages/SearchResults';
import Members from './pages/Members';
import AcceptInvite from './pages/AcceptInvite';
import Settings from './pages/Settings';
import Placeholder from './pages/Placeholder';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

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
      <ActiveCampaignProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/campaigns" replace />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/:cid" element={<CampaignHome />} />
            <Route path="campaigns/:cid/members" element={<Members />} />
            <Route path="campaigns/:cid/search" element={<SearchResults />} />
            <Route path="invite/:token" element={<AcceptInvite />} />
            <Route path="campaigns/:cid/:type" element={<ElementList />} />
            <Route path="campaigns/:cid/:type/:elementId" element={<ElementEditor />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Placeholder />} />
          </Route>
        </Routes>
      </ActiveCampaignProvider>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AuthThemeSync />
          <Gate />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
