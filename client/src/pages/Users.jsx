"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import apiConfig from "./../config/api"
import { Search, ChevronLeft, ChevronRight } from "react-feather"
import toast from "react-hot-toast"

const Users = () => {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const usersPerPage = 10

  useEffect(() => {
    fetchUsers(currentPage, usersPerPage, searchTerm)
  }, [currentPage, searchTerm])

  const fetchUsers = async (page, limit, search = "") => {
    try {
      setLoading(true)
      // API call to fetch users with pagination
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (search) {
        queryParams.append("search", search)
      }

      const response = await fetch(`${apiConfig.baseURL}/students?${queryParams.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.students)
      setTotalUsers(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")

      // Mock data for demonstration
      setUsers(
        Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Student ${i + 1}`,
          email: `student${i + 1}@example.com`,
          phone: `123-456-${7890 + i}`,
          instituteName: "Springfield High School",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
        })),
      )
      setTotalUsers(25)
      setTotalPages(3)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setCurrentPage(1)

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchUsers(1, usersPerPage, value)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleViewProfile = (user) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const closeUserDetails = () => {
    setShowUserDetails(false)
    setSelectedUser(null)
  }

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Users List</h1>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600"></div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Institute
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-[13px] font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[13px] font-medium text-gray-900">{user.name || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[13px] text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[13px] text-gray-500">{user.phone || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[13px] text-gray-500">{user.instituteName || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[13px] text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-[13px] font-medium">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="text-violet-600 hover:text-violet-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-[13px] text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-[13px] text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{users.length > 0 ? (currentPage - 1) * usersPerPage + 1 : 0}</span>{" "}
                    to <span className="font-medium">{Math.min(currentPage * usersPerPage, totalUsers)}</span> of{" "}
                    <span className="font-medium">{totalUsers}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-[13px] -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-[13px] font-medium ${
                        currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-[13px] font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-violet-50 border-violet-600 text-violet-600"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-[13px] font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>

              <div className="flex sm:hidden justify-between w-full">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-[13px] font-medium rounded-md ${
                    currentPage === 1 ? "text-gray-300 bg-gray-100" : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-[13px] font-medium rounded-md ${
                    currentPage === totalPages ? "text-gray-300 bg-gray-100" : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-65 z-40" onClick={closeUserDetails}></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">User Profile</h2>
                <button onClick={closeUserDetails} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="sm:w-1/3 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-gray-500">
                        {selectedUser.name ? selectedUser.name.charAt(0) : selectedUser.email.charAt(0)}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 text-center">{selectedUser.name || "N/A"}</h2>
                    <p className="text-[13px] text-gray-500 mb-4 text-center">{selectedUser.email}</p>
                  </div>

                  <div className="sm:w-2/3">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="text-[13px] font-medium text-gray-500">Phone</h4>
                        <p className="mt-1 text-[13px]">{selectedUser.phone || "N/A"}</p>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-medium text-gray-500">Institute</h4>
                        <p className="mt-1 text-[13px]">{selectedUser.instituteName || "N/A"}</p>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-medium text-gray-500">Joined Date</h4>
                        <p className="mt-1 text-[13px]">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button variant="outline" size="sm" className="mr-2" onClick={closeUserDetails}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Users
