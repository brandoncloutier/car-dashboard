import { createContext, useState, useContext } from "react";

const SidebarContext = createContext()

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => setIsSidebarOpen(prev => !prev)

  const value = {
    isSidebarOpen,
    handleSidebarToggle
  }
  return (
    <SidebarContext.Provider value={value} >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebarContext = () => useContext(SidebarContext)