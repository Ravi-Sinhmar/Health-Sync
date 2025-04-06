"use client"

import { createContext, useContext, useState, useEffect } from "react"
import apiConfig from './config/api';

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${apiConfig.baseURL}/auth/check`, {
          method: "GET",
          credentials: 'include', // Important for cookies
        })

        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data.user)
          setIsAuthenticated(true)
        } else {
          setCurrentUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setCurrentUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      setCurrentUser(data.user)
      setIsAuthenticated(true)
      return data
    } catch (error) {
      throw error
    }
  }

  const signup = async (email, password) => {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Signup failed")
      }

      return data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch(`${apiConfig.baseURL}/auth/logout`, {
        method: "POST",
        credentials: 'include', // Important for cookies
      })
      
      setCurrentUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout,
    loading,
    setIsAuthenticated
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}