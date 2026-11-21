import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FlowField } from '@/components/FlowField';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const TITLES: Record<string, string> = {
  '/': 'Sridhar Mani · AI Engineer',
  '/work': 'Work · Sridhar Mani',
  '/experience': 'Experience · Sridhar Mani',
  '/skills': 'Skills · Sridhar Mani',
  '/contact': 'Contact · Sridhar Mani',
  '/live': 'Live products · Sridhar Mani',
};

/** Shared shell: one persistent 3D layer, the navigation and footer, and the routed page. */
export const SiteLayout = () => {
  useSmoothScroll();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.title = TITLES[pathname] || 'Sridhar Mani';
  }, [pathname]);

  return (
    <div className="min-h-screen text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative">
      <FlowField />
      <Navigation />
      <main key={pathname} className="page-enter relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
