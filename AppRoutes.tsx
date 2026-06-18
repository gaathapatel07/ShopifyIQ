import { Routes, Route } from 'react-router-dom'
import { LoginPage, SignupPage } from '../pages/AuthPages'
import OverviewPage   from '../pages/OverviewPage'
import RevenuePage    from '../pages/RevenuePage'
import CustomersPage  from '../pages/CustomersPage'
import CopilotPage    from '../pages/CopilotPage'
import SettingsPage   from '../pages/SettingsPage'
import AppLayout      from '../layouts/AppLayout'
import LandingPage    from '../components/landing/LandingPage'
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/signup"  element={<SignupPage />} />
      <Route path="/dashboard" element={<AppLayout />}>
        <Route index            element={<OverviewPage />} />
        <Route path="revenue"   element={<RevenuePage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="copilot"   element={<CopilotPage />} />
        <Route path="settings"  element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
