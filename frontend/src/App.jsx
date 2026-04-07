import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout
import Navbar from './components/Navbar';

// Common Pages
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import Success from './pages/common/Success';
import Profile from './pages/common/Profile';
import Contact from './pages/common/Contact';

// Farmer Pages
import Dashboard from './pages/farmer/Dashboard';
import CropPrediction from './pages/farmer/CropPrediction';
import YieldPrediction from './pages/farmer/YieldPrediction';
import RainfallPrediction from './pages/farmer/RainfallPrediction';
import CropRecommendation from './pages/farmer/CropRecommendation';
import FertilizerRecommendation from './pages/farmer/FertilizerRecommendation';
import SellingHistory from './pages/farmer/SellingHistory';
import ChatBot from './pages/farmer/ChatBot';
import WeatherForecast from './pages/farmer/WeatherForecast';
import NewsFeed from './pages/farmer/NewsFeed';

// Customer Pages
import Marketplace from './pages/customer/Marketplace';
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import IntelligenceHub from './pages/customer/IntelligenceHub';
import CropStocks from './pages/customer/CropStocks';
import MyOrders from './pages/customer/MyOrders';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminFarmers, AdminCustomers, AdminCropStock, AdminQueries } from './pages/admin/AdminPages';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roleRequired && user?.role !== roleRequired) return <Navigate to="/" replace />;
  return children;
};

const AnyProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/customer/stocks" element={<CropStocks />} />
        <Route path="/customer/orders" element={<MyOrders />} />
        <Route path="/success" element={<Success />} />
        <Route path="/intelligence" element={<IntelligenceHub />} />
        <Route path="/contact" element={<Contact />} />

        {/* Shared Protected Routes */}
        <Route path="/profile" element={<AnyProtectedRoute><Profile /></AnyProtectedRoute>} />

        {/* Farmer Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute roleRequired="farmer"><Dashboard /></ProtectedRoute>} />
        <Route path="/farmer/prediction/crop" element={<ProtectedRoute roleRequired="farmer"><CropPrediction /></ProtectedRoute>} />
        <Route path="/farmer/prediction/yield" element={<ProtectedRoute roleRequired="farmer"><YieldPrediction /></ProtectedRoute>} />
        <Route path="/farmer/prediction/rainfall" element={<ProtectedRoute roleRequired="farmer"><RainfallPrediction /></ProtectedRoute>} />
        <Route path="/farmer/recommendation/crop" element={<ProtectedRoute roleRequired="farmer"><CropRecommendation /></ProtectedRoute>} />
        <Route path="/farmer/recommendation/fertilizer" element={<ProtectedRoute roleRequired="farmer"><FertilizerRecommendation /></ProtectedRoute>} />
        <Route path="/farmer/trade" element={<ProtectedRoute roleRequired="farmer"><Dashboard /></ProtectedRoute>} />
        <Route path="/farmer/stocks" element={<ProtectedRoute roleRequired="farmer"><Dashboard /></ProtectedRoute>} />
        <Route path="/farmer/selling-history" element={<ProtectedRoute roleRequired="farmer"><SellingHistory /></ProtectedRoute>} />
        <Route path="/farmer/tools/chatbot" element={<ProtectedRoute roleRequired="farmer"><ChatBot /></ProtectedRoute>} />
        <Route path="/farmer/tools/weather" element={<ProtectedRoute roleRequired="farmer"><WeatherForecast /></ProtectedRoute>} />
        <Route path="/farmer/tools/news" element={<ProtectedRoute roleRequired="farmer"><NewsFeed /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<ProtectedRoute roleRequired="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/farmers" element={<ProtectedRoute roleRequired="admin"><AdminFarmers /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute roleRequired="admin"><AdminCustomers /></ProtectedRoute>} />
        <Route path="/admin/stock" element={<ProtectedRoute roleRequired="admin"><AdminCropStock /></ProtectedRoute>} />
        <Route path="/admin/queries" element={<ProtectedRoute roleRequired="admin"><AdminQueries /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
