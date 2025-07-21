import { useSidebarContext } from "../../contexts/SidebarContext"
import { useThemeContext } from '../../contexts/ThemeContext';
import { LayoutDashboard } from "lucide-react";
import { useEffect } from "react";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import SimpleToggle from "../ui/SimpleToggle";
import { useLocation, Link } from "react-router";
import { useEditModeContext } from "../../contexts/EditModeContext";
import { SquarePen } from "lucide-react";

const Sidebar = () => {
  const { isSidebarOpen, handleSidebarToggle } = useSidebarContext()
  const { dark, handleDarkToggle } = useThemeContext()
  const { editMode, handleEditModeToggle } = useEditModeContext()
  const location = useLocation()

  return (
    <div className={`w-18 h-full overflow-hidden text-nowrap shrink-0 z-[1000]`}>
      <div className="p-2 flex flex-col h-full justify-between items-center">
        {/* Top Buttons */}
        <div className="flex flex-col gap-2">
          <ul>
            <NavButton to={"/"} location={location} Icon={LayoutDashboard} name={""} />
          </ul>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col gap-4 items-center mb-2">
          <SquarePen onClick={handleEditModeToggle} className={`w-[30px] h-[30px] hover:cursor-pointer ${editMode ? "text-green-500" : ""}`} />
          <DarkModeSwitch
            checked={dark}
            onChange={handleDarkToggle}
            size={30}
          />
        </div>
      </div>

      {/*<button className="absolute text-white top-2 right-2" onClick={handleSidebarToggle}>X</button>*/}
    </div>
  )
}

const NavButton = ({ to, location, Icon, name }) => {
  return (
    <Link to={to}>
      <div className="flex items-center">
        <div className={`py-[10px] px-[10px] text-sm rounded-md ${to === location.pathname ? "bg-gray-200 dark:bg-gray-800" : ""} grow flex gap-3 items-center`}>
          {<Icon className="h-[30px] w-[30px] shrink-0" />}
        </div>
      </div>
    </Link>
  )
}

export default Sidebar