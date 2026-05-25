import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import NotFoundPage from './pages/NotFoundPage'
import {
  ForgotPasswordPage,
  LoginPage,
  ResetPasswordPage,
  SignUpPage,
  VerifyEmailPage,
} from './pages/MemberAuthPage'
import CheckoutPage from './pages/CheckoutPage'
import PricingPage from './pages/PricingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/pricing" replace />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/app/signup" element={<SignUpPage />} />
        <Route path="/app/verify-email" element={<VerifyEmailPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/app/reset-password" element={<ResetPasswordPage />} />
        <Route path="/app/account" element={<Navigate to="/pricing" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
