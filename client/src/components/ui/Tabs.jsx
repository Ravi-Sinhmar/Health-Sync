"use client"

import React from "react"

export const TabsContext = React.createContext(null)

export const Tabs = ({ defaultValue, children, className = "", ...props }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export const TabsList = ({ children, className = "", ...props }) => {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`} role="tablist" {...props}>
      {children}
    </div>
  )
}

export const TabsTrigger = ({ value, children, className = "", ...props }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)

  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      data-state={activeTab === value ? "active" : "inactive"}
      onClick={() => setActiveTab(value)}
      className={`
        px-3 py-1.5 text-sm font-medium rounded-md transition-all
        ${activeTab === value ? "bg-white text-violet-700 shadow-sm" : "text-gray-600 hover:text-gray-900"}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, children, className = "", ...props }) => {
  const { activeTab } = React.useContext(TabsContext)

  if (activeTab !== value) return null

  return (
    <div role="tabpanel" data-state={activeTab === value ? "active" : "inactive"} className={className} {...props}>
      {children}
    </div>
  )
}

