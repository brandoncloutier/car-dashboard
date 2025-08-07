import { useState } from "react"
import { Link } from "react-router";
import { LayoutDashboard, X } from "lucide-react";
import { useEditModeContext } from "../../contexts/EditModeContext";
import { deleteDashboard } from "../../features/dashboards/dashboardsSlice";

import Modal from "../Modal/Modal";
import { useDispatch } from "react-redux";

const DashboardWidget = ({ dashboard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { editMode } = useEditModeContext()

  const handleExitClick = (event) => {
    event.stopPropagation()
    event.preventDefault()
    setIsModalOpen(true)
  }
  return (
    <div className="relative">
      <Link className="hover:cursor-pointer" to={`./dashboard/${dashboard.id}`}>
        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex flex-col space-y-2 h-[175px] relative">
          <div className="grow rounded-md flex justify-center items-center bg-gray-200 dark:bg-gray-700">
            <LayoutDashboard className="h-8 w-8" />
          </div>
          <div className="flex justify-between items-center shrink-0">
            <span className="text-sm font-medium text-muted-foreground/80 uppercase tracking-wider mb-0 truncate">{dashboard.name}</span>
            {editMode ? <button className="bg-red-600 rounded hover:cursor-pointer px-[4px] text-sm text-white" onClick={handleExitClick}>Delete</button> : null}
          </div>
        </div>
      </Link>

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm" title={`Delete ${dashboard.name.toUpperCase()} Dashboard`}>
        <ConfirmDeleteButtons onClose={() => setIsModalOpen(false)} dashboardId={dashboard.id} />
      </Modal>
    </div>
  )
}

const ConfirmDeleteButtons = ({ onClose, dashboardId }) => {
  const dispatch = useDispatch()
  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(deleteDashboard(dashboardId))
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mb-2 sm:mb-0 hover:cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-primary/90 h-10 px-4 py-2 hover:cursor-pointer"
        >
          Delete Dashboard
        </button>
      </div>
    </form>
  )
}

export default DashboardWidget