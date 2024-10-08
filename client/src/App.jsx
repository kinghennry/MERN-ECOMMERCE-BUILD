import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth } from './store/auth-slice'
// todo********(download codenium before end of this )
// todo download comprehensive vscodeshorts videos from youtube

//common layouts
import CheckAuth from './components/common/check-auth'

// All layouts and pages
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'

//adminLayouts
import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminProducts from './pages/admin-view/products'
import AdminOrders from './pages/admin-view/orders'
import AdminFeatures from './pages/admin-view/features'

//shopLayouts
import ShoppingLayout from './components/shopping-view/layout'
import PaymentSuccessPage from './pages/shopping-view/payment-success'
import ShoppingHome from './pages/shopping-view/home'
import ShoppingListing from './pages/shopping-view/listing'
import ShoppingCheckout from './pages/shopping-view/checkout'
import ShoppingAccount from './pages/shopping-view/account'
import PaypalReturnPage from './pages/shopping-view/paypal-return'
import SearchProducts from './pages/shopping-view/search'

import NotFound from './pages/not-found'
import UnauthPage from './pages/unauth-page'

export default function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  // sb-juqbg32315118@personal.example.com
  // 1t#9Go<I

  if (isLoading) return <Skeleton className='w-[800] bg-black h-[600px]' />

  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      <Routes>
        <Route element={<CheckAuth></CheckAuth>} path='/'></Route>
        <Route
          path='/auth'
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path='login' element={<AuthLogin />} />
          <Route path='register' element={<AuthRegister />} />
        </Route>

        {/* admin layouts */}
        <Route
          path='/admin'
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='features' element={<AdminFeatures />} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='orders' element={<AdminOrders />} />
        </Route>

        {/* shopping layouts */}
        <Route
          path='/shop'
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path='home' element={<ShoppingHome />} />
          <Route path='payment-success' element={<PaymentSuccessPage />} />
          <Route path='listing' element={<ShoppingListing />} />
          <Route path='checkout' element={<ShoppingCheckout />} />
          <Route path='account' element={<ShoppingAccount />} />
          <Route path='paypal-return' element={<PaypalReturnPage />} />
          <Route path='search' element={<SearchProducts />} />
        </Route>

        <Route path='/unauth-page' element={<UnauthPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}
