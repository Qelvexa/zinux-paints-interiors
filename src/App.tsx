import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { PaintsPage } from './pages/PaintsPage';
import { QuotePage } from './pages/QuotePage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminSetup } from './pages/admin/AdminSetup';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminAppearance } from './pages/admin/AdminAppearance';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminSeo } from './pages/admin/AdminSeo';
import { AdminLegal } from './pages/admin/AdminLegal';
import { AdminSettings } from './pages/admin/AdminSettings';

// Scroll to top and SPA reload recovery helper
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if redirect was stored in sessionStorage by 404 handler
    const spaRedirect = sessionStorage.getItem('spa_redirect');
    if (spaRedirect) {
      sessionStorage.removeItem('spa_redirect');
      navigate(spaRedirect, { replace: true });
      return;
    }

    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, navigate]);

  return null;
};

// Layout wrapper for public pages (with public Navbar & Footer)
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen text-slate-900 antialiased selection:bg-red-500 selection:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <SiteSettingsProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
            <Route path="/projects" element={<PublicLayout><ProjectsPage /></PublicLayout>} />
            <Route path="/paints" element={<PublicLayout><PaintsPage /></PublicLayout>} />
            <Route path="/quote" element={<PublicLayout><QuotePage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
            <Route path="/cookie" element={<PublicLayout><CookiePolicyPage /></PublicLayout>} />

            {/* Admin Authentication & Setup */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/setup" element={<AdminSetup />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="/admin/content" element={<AdminProtectedRoute><AdminContent /></AdminProtectedRoute>} />
            <Route path="/admin/appearance" element={<AdminProtectedRoute><AdminAppearance /></AdminProtectedRoute>} />
            <Route path="/admin/services" element={<AdminProtectedRoute><AdminServices /></AdminProtectedRoute>} />
            <Route path="/admin/projects" element={<AdminProtectedRoute><AdminProjects /></AdminProtectedRoute>} />
            <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
            <Route path="/admin/media" element={<AdminProtectedRoute><AdminMedia /></AdminProtectedRoute>} />
            <Route path="/admin/enquiries" element={<AdminProtectedRoute><AdminEnquiries /></AdminProtectedRoute>} />
            <Route path="/admin/seo" element={<AdminProtectedRoute><AdminSeo /></AdminProtectedRoute>} />
            <Route path="/admin/legal" element={<AdminProtectedRoute><AdminLegal /></AdminProtectedRoute>} />
            <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </SiteSettingsProvider>
  );
}

export default App;
