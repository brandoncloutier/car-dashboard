import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext()

export const ThemeProvider = ({children}) => {
  const [dark, setDark] = useState(() => {
    const theme = localStorage.getItem("theme")
    if (theme === "dark") document.documentElement.classList.add("dark")
    return theme === "dark"
  })

  const handleDarkToggle = () => {
    document.documentElement.classList.add('theme-transition')
    setDark((prev) => !prev)
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 0)
    localStorage.setItem("theme", !dark ? "dark" : "light")
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  const value = {
    dark,
    handleDarkToggle
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeContext)