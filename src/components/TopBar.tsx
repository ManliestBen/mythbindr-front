import { useLocation } from 'react-router-dom';
import ThemeQuickSwitch from './ThemeQuickSwitch';

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/settings': 'Settings',
};

export default function TopBar() {
  const { pathname } = useLocation();
  const derived =
    pathname.replace('/', '').replace(/^\w/, (c) => c.toUpperCase()) ||
    'MythBindr';
  const title = TITLES[pathname] ?? derived;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-app-border bg-app-surface px-6">
      <h2 className="font-heading text-base font-bold">{title}</h2>
      <ThemeQuickSwitch />
    </header>
  );
}
