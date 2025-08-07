import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <div className="flex h-full relative overflow-hidden">
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default App
