import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
// import Footer from "../Footer"  ← comment this out

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg">
      <Navbar/>
      <main className="flex-1">
        <Outlet/>
      </main>
      {/* <Footer/> */}
    </div>
  )
}

export default Layout