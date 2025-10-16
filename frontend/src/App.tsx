
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../src/components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import ProductsPage from './pages/ProductsPage';
import NewPurchasePage from './pages/NewPurchasePage';
import PurchasesPage from './pages/PurchasesPage';
import ClientDetailPage from './pages/ClientDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/:id" element={<ClientDetailPage />} /> { }
        <Route path="products" element={<ProductsPage />} /> { }
        <Route path="purchases" element={<PurchasesPage />} /> { }
        <Route path="purchases/new" element={<NewPurchasePage />} />
      </Route>
    </Routes>
  );
}

export default App;