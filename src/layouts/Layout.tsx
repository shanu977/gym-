import { Outlet } from 'react-router-dom'
import { AssistantWidget } from '../components/AssistantWidget'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'

export function Layout() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AssistantWidget />
    </div>
  )
}
