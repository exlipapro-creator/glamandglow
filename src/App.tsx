import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import StoreLayout from './components/store/StoreLayout'
import CartDrawer from './components/store/CartDrawer'
import HomePage from './pages/store/HomePage'
import ShopPage from './pages/store/ShopPage'
import CollectionPage from './pages/store/CollectionPage'
import ProductPage from './pages/store/ProductPage'
import CheckoutPage from './pages/store/CheckoutPage'
import OrderConfirmationPage from './pages/store/OrderConfirmationPage'
import OpsLayout from './pages/ops/OpsLayout'
import OpsDashboard from './pages/ops/OpsDashboard'
import OpsOrders from './pages/ops/OpsOrders'
import OpsProducts from './pages/ops/OpsProducts'
import OpsCollections from './pages/ops/OpsCollections'
import OpsHomepage from './pages/ops/OpsHomepage'
import OpsCustomers from './pages/ops/OpsCustomers'
import OpsSettings from './pages/ops/OpsSettings'
import NotFoundPage from './pages/store/NotFoundPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderNumber" element={<OrderConfirmationPage />} />
        </Route>
        <Route path="/ops" element={<OpsLayout />}>
          <Route index element={<OpsDashboard />} />
          <Route path="orders" element={<OpsOrders />} />
          <Route path="products" element={<OpsProducts />} />
          <Route path="collections" element={<OpsCollections />} />
          <Route path="homepage" element={<OpsHomepage />} />
          <Route path="customers" element={<OpsCustomers />} />
          <Route path="settings" element={<OpsSettings />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CartDrawer />
    </>
  )
}
