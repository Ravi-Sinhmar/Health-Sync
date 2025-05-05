"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Menu, X, User, Heart, LogOut, HelpCircle, Home, Users, Settings, Edit, Activity } from "react-feather"
import { CiDumbbell } from "react-icons/ci";

import Button from "../ui/Button"
import { overlayState } from "../../recoil/atoms"
import { useSetRecoilState } from "recoil"

const Header = () => {
    const setIsOverlay = useSetRecoilState(overlayState)
    const [isNavOpen, setIsNavOpen] = useState(false)
    const { currentUser, logout ,isAuthenticated } = useAuth()
    const navigate = useNavigate()

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

    return (
        <>
            <header className="bg-white shadow-[13px]">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <span className="text-xl font-bold text-violet-600">Health Sync</span>
                    </Link>

                   <div className="flex justify-center items-center gap-6">
                  
                
                   <div className="flex items-center gap-4">
                        {isAuthenticated || currentUser ? (
                            <>
                   
                    <button
                                onClick={toggleNav}
                                className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label="Open navigation menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            </>
                            
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-1.5 rounded-md transition-colors"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                   </div>

                    
                   
                </div>
            </header>

            {/* Navigation Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${isNavOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-4 flex flex-col h-fit mt-2 bg-white rounded-l-lg">
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
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="flex items-center p-2 rounded-md text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                                    onClick={closeNav}
                                >
                                    <Home className="h-5 w-5 mr-3" />
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                    className="flex items-center p-2 rounded-md text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                                    onClick={closeNav}
                                >
                                    <User className="h-5 w-5 mr-3" />
                                    <span>My Profile</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/workouts"
                                    className="flex items-center p-2 rounded-md text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                                    onClick={closeNav}
                                >
                                    <Activity className="h-5 w-5 mr-3" />
                                    <span>Workouts</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/users"
                                    className="flex items-center p-2 rounded-md text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                                    onClick={closeNav}
                                >
                                    <Users className="h-5 w-5 mr-3" />
                                    <span>Users</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center p-2 rounded-md text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                                    onClick={closeNav}
                                >
                                    <Users className="h-5 w-5 mr-3" />
                                    <span>Health Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/help"
                                    className="flex items-center p-2 rounded-md text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                                    onClick={closeNav}
                                >
                                    <HelpCircle className="h-5 w-5 mr-3" />
                                    <span>Help & Support</span>
                                </Link>
                            </li>
                   
                        </ul>
                    </nav>
                    <div className="pt-2 mt-6 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full p-2 rounded-md text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header