import { Navigate, useLocation } from 'react-router-dom'

export default function CheckAuth({ children, user, isAuthenticated }) {
  // location gives you your current location
  const location = useLocation()
  console.log(location.pathname, isAuthenticated)

  //if user hits '/' route & is not auth'd redirect to login & if he is auth'd, redirect to appropriate route
  if (location.pathname === '/') {
    if (!isAuthenticated) {
      return <Navigate to='auth/login' />
    } else {
      if (user?.role === 'admin') {
        return <Navigate to='admin/dashboard' />
      } else {
        return <Navigate to='shop/home' />
      }
    }
  }

  // check if user is not loggedIn then he tries to access any protected routes i.e routes not login or register
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes('/login') ||
      location.pathname.includes('/register')
    )
  ) {
    return <Navigate to='/auth/login' />
  }

  // if user is loggedIn then tries to access login routes redirect to shopping or admin route
  if (
    isAuthenticated &&
    (location.pathname.includes('/login') ||
      location.pathname.includes('/register'))
  ) {
    //check if he is admin or normal user
    if (user?.role === 'admin') {
      return <Navigate to='/admin/dashboard' />
    } else {
      return <Navigate to='/shop/home' />
    }
  }

  //if loggedIn user not admin tries to access admin page
  if (
    isAuthenticated &&
    user?.role !== 'admin' &&
    location.pathname.includes('admin')
  ) {
    return <Navigate to='/unauth-page' />
  }

  // if loggedIn admin tries to get shop page
  if (
    isAuthenticated &&
    user?.role === 'admin' &&
    location.pathname.includes('shop')
  ) {
    return <Navigate to='/admin/dashboard' />
  }

  return <>{children}</>
}
