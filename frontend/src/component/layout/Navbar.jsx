import React from 'react'
import { NavLink, Link } from 'react-router-dom'

function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [searchActive, setSearchActive] = React.useState(false)

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-black/70 backdrop-blur-md sticky top-0 z-50">

      {/* LEFT SIDE - Logo + Nav Links */}
      <div className="flex items-center gap-12">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-netflix-red rounded-full flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <span className="text-2xl font-bold text-gray-300">
            Videora
          </span>
        </Link>

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-8 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold border-b-2 border-netflix-red pb-1"
                : "text-gray-400 hover:text-white transition duration-300"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold border-b-2 border-netflix-red pb-1"
                : "text-gray-400 hover:text-white transition duration-300"
            }
          >
            Search
          </NavLink>

          <NavLink
            to="/watch/1"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold border-b-2 border-netflix-red pb-1"
                : "text-gray-400 hover:text-white transition duration-300"
            }
          >
            Video Player
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold border-b-2 border-netflix-red pb-1"
                : "text-gray-400 hover:text-white transition duration-300"
            }
          >
            Subscription
          </NavLink>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* Search Icon */}
        <button
          onClick={() => setSearchActive(!searchActive)}
          className="text-gray-400 hover:text-white transition duration-300"
          aria-label="Search"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="m21 21-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Notifications */}
        <button
          className="relative text-gray-400 hover:text-white transition duration-300"
          aria-label="Notifications"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="absolute -top-2 -right-2 bg-netflix-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div className="w-8 h-8 rounded-full bg-bilibili-blue flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
        </Link>
        <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold border-b-2 border-netflix-red pb-1"
                : "text-gray-400 hover:text-white transition duration-300"
            }
          >
           Signup
          </NavLink>
   <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold border-b-2 border-netflix-red pb-1"
                : "text-gray-400 hover:text-white transition duration-300"
            }
          >
           Login
          </NavLink>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-gray-300 hover:text-white transition"
          aria-label="Menu"
        >
          {open ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12h18M3 6h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-black/90 backdrop-blur-md border-b border-white/10 py-4 px-6 lg:hidden flex flex-col gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold"
                : "text-gray-400 hover:text-white transition duration-300"
            }
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold"
                : "text-gray-400 hover:text-white transition duration-300"
            }
            onClick={() => setOpen(false)}
          >
            Search
          </NavLink>

          <NavLink
            to="/watch/1"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold"
                : "text-gray-400 hover:text-white transition duration-300"
            }
            onClick={() => setOpen(false)}
          >
            Video Player
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-netflix-red font-semibold"
                : "text-gray-400 hover:text-white transition duration-300"
            }
            onClick={() => setOpen(false)}
          >
            Subscription
          </NavLink>
        </div>
      )}
    </nav>
  )
}

export default Navbar