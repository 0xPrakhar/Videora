import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider,createRoutesFromElements, Route } from 'react-router-dom'
import Layout from './component/layout/Layout'
import HomePage from './pages/HomePage'
import WatchPage from './pages/WatchPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SignupPage from './pages/SignupPage'

const router =createBrowserRouter(
  createRoutesFromElements(
   <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="watch/:id" element={<WatchPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="signup" element={<SignupPage />} />
    </Route>
  )
  
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)