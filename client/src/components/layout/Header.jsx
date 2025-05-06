"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Menu, X, User, LogOut, HelpCircle, Home, Users, Settings, Activity, MessageSquare } from "react-feather"
import { CiDumbbell } from "react-icons/ci"
import { overlayState } from "../../recoil/atoms"
import { useSetRecoilState } from "recoil"

const Header = () => {
    const setIsOverlay = useSetRecoilState(overlayState)
    const [isNavOpen, setIsNavOpen] = useState(false)
    const { currentUser, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate("/")
        setIsNavOpen(false)
    }

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen)
    }

    const closeNav = () => {
        setIsNavOpen(false)
    }

    useEffect(() => {
        setIsOverlay(isNavOpen)
    }, [isNavOpen])

    const navItems = [
        {
            name: "Home",
            path: "/",
            icon: <Home className="h-5 w-5" />,
            main: true
        },
        {
            name: "Profile",
            path: "/profile",
            icon: <User className="h-5 w-5" />,
            main: true
        },
        {
            name: "Health",
            path: null,
            icon: <Activity className="h-5 w-5" />,
            main: true,
            subItems: [
                {
                    name: "Dashboard",
                    path: "/dashboard",
                },
                {
                    name: "Workouts",
                    path: "/workouts",
                }
            ]
        },
        {
            name: "Community",
            path: null,
            icon: <Users className="h-5 w-5" />,
            main: true,
            subItems: [
                {
                    name: "Users",
                    path: "/users",
                },
                {
                    name: "AI Assistant",
                    path: "/chat",
                }
            ]
        },
        {
            name: "Help",
            path: "/help",
            icon: <HelpCircle className="h-5 w-5" />,
            main: true
        }
    ]

    const isActive = (path) => {
        return location.pathname === path
    }

    return (
        <>
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mobile Header - shows at 768px and below */}
                    <div className="lg:hidden flex justify-between items-center py-3">
                        <Link to="/" className="flex items-center">
                            <span className="text-lg font-bold text-violet-600">Health Sync</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            {isAuthenticated || currentUser ? (
                                <button
                                    onClick={toggleNav}
                                    className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                                    aria-label="Open navigation menu"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-1.5 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Desktop Header - shows above 768px */}
                    {isAuthenticated || currentUser ? (
                        <div className="hidden lg:flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <Link to="/" className="flex items-center">
                                    <span className="text-xl font-bold text-violet-600">Health Sync</span>
                                </Link>
                            </div>

                            <nav className="flex items-center space-x-1">
                                {navItems.map((item) => (
                                    <div key={item.name} className="relative group">
                                        {item.path ? (
                                            <Link
                                                to={item.path}
                                                className={`
                                                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                                    ${isActive(item.path) ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-gray-50"}
                                                `}
                                            >
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </Link>
                                        ) : (
                                            <button
                                                className={`
                                                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                                    ${item.subItems?.some(sub => isActive(sub.path)) ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-gray-50"}
                                                `}
                                            >
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </button>
                                        )}

                                        {item.subItems && (
                                            <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-100">
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        to={subItem.path}
                                                        className={`
                                                            block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700
                                                            ${isActive(subItem.path) ? "bg-violet-50 text-violet-700" : ""}
                                                        `}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-violet-700"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Show only logo and auth buttons when not logged in (desktop)
                        <div className="hidden lg:flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <Link to="/" className="flex items-center">
                                    <span className="text-xl font-bold text-violet-600">Health Sync</span>
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link 
                                    to="/login" 
                                    className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-1.5 transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            {(isAuthenticated || currentUser) && (
                <div
                    className={`fixed top-0 right-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${isNavOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="p-4 flex flex-col h-full bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                            <button
                                onClick={closeNav}
                                className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label="Close navigation menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <nav className="flex-1">
                            <ul className="space-y-1">
                                {navItems.map((item) => (
                                    <li key={item.name}>
                                        {item.path ? (
                                            <Link
                                                to={item.path}
                                                className={`
                                                    flex items-center p-3 rounded-md text-gray-700 hover:bg-violet-50 hover:text-violet-600
                                                    ${isActive(item.path) ? "bg-violet-50 text-violet-700" : ""}
                                                `}
                                                onClick={closeNav}
                                            >
                                                {item.icon}
                                                <span className="ml-3">{item.name}</span>
                                            </Link>
                                        ) : (
                                            <div className="p-3">
                                                <div className="flex items-center text-gray-700">
                                                    {item.icon}
                                                    <span className="ml-3 font-medium">{item.name}</span>
                                                </div>
                                                <ul className="mt-1 pl-8 space-y-1">
                                                    {item.subItems?.map((subItem) => (
                                                        <li key={subItem.name}>
                                                            <Link
                                                                to={subItem.path}
                                                                className={`
                                                                    block p-2 rounded-md text-gray-600 hover:bg-violet-50 hover:text-violet-600
                                                                    ${isActive(subItem.path) ? "bg-violet-50 text-violet-700" : ""}
                                                                `}
                                                                onClick={closeNav}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="pt-2 mt-auto border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full p-3 rounded-md text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="ml-3">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header