import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { InventoryProvider } from './context/InventoryContext';
import { GarageProvider } from './context/GarageContext';
import { SellRequestsProvider } from './context/SellRequestsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GarageDrawer } from './components/GarageDrawer';
import { CompareTray } from './components/CompareTray';
import { AutosatLoadingScreen } from './components/AutosatLogo';
import { HomePage } from './pages/HomePage';

const BrandInventoryPage = lazy(() =>
  import('./pages/BrandInventoryPage').then((m) => ({ default: m.BrandInventoryPage }))
);
const CarDetailPage = lazy(() =>
  import('./pages/CarDetailPage').then((m) => ({ default: m.CarDetailPage }))
);
const SearchResultsPage = lazy(() =>
  import('./pages/SearchResultsPage').then((m) => ({ default: m.SearchResultsPage }))
);
const SellYourCarPage = lazy(() =>
  import('./pages/SellYourCarPage').then((m) => ({ default: m.SellYourCarPage }))
);
const ComparePage = lazy(() =>
  import('./pages/ComparePage').then((m) => ({ default: m.ComparePage }))
);
const RentalsPage = lazy(() =>
  import('./pages/RentalsPage').then((m) => ({ default: m.RentalsPage }))
);
const DeliveryPage = lazy(() =>
  import('./pages/DeliveryPage').then((m) => ({ default: m.DeliveryPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const ReservePage = lazy(() =>
  import('./pages/ReservePage').then((m) => ({ default: m.ReservePage }))
);
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-[#B5945B] px-4 py-1.5 text-center text-xs font-semibold text-[#111214]">
      Offline Mode — Showing cached AUTOSAT showroom inventory
    </div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1"
      >
        <Suspense fallback={<AutosatLoadingScreen />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventory" element={<BrandInventoryPage />} />
            <Route path="/brands/:brand" element={<BrandInventoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />
            <Route path="/sell-your-car" element={<SellYourCarPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/rentals" element={<RentalsPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reserve" element={<ReservePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <InventoryProvider>
        <SellRequestsProvider>
          <GarageProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="flex min-h-screen flex-col bg-[#F5F4F0] text-[#111214]">
                <OfflineBanner />
                <Navbar />
                <AnimatedRoutes />
                <Footer />
                <GarageDrawer />
                <CompareTray />
                <FloatingWhatsApp />
              </div>
            </BrowserRouter>
          </GarageProvider>
        </SellRequestsProvider>
      </InventoryProvider>
    </MotionConfig>
  );
}
