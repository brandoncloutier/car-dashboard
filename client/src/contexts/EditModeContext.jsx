import { createContext, useContext, useState } from "react";

const EditModeContext = createContext();

export const EditModeProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false)

  const handleEditModeToggle = () => setEditMode(prev => !prev)

  const value = {
    editMode,
    handleEditModeToggle
  }
  return (
    <EditModeContext.Provider value={value} >
      {children}
    </EditModeContext.Provider>
  )
}

export const useEditModeContext = () => useContext(EditModeContext)