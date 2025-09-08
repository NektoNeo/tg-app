import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { initMiniApp, postEvent } from '@tma.js/sdk';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import { OrderSuccess } from './pages/OrderSuccess';
import AboutPage from './pages/AboutPage';
import DeliveryPage from './pages/DeliveryPage';
import FAQPage from './pages/FAQPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminRoute } from './components/AdminRoute';
import { CartDrawer } from './components/Cart/CartDrawer';
import { CartButton } from './components/Cart/CartButton';
import './index.css';

function App() {

  useEffect(() => {
    // Initialize Telegram Mini App
    try {
      const [miniApp] = initMiniApp();
      
      // Expand to full height
      miniApp.ready();
      miniApp.expand();
      
      // Set theme based on Telegram theme
      // const tgTheme = miniApp.themeParams;
      
      // Track app opened
      postEvent('web_app_open');
    } catch (error) {
      console.log('Running outside Telegram:', error);
      // Development mode - app works outside Telegram
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-va-dark text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
        <CartDrawer />
        <CartButton className="fixed bottom-6 right-6 z-30" />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#2d2d2d',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid #433179',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
