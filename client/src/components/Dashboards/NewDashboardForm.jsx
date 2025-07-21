import { useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { asyncCreateNewDashboard } from "../../features/dashboards/dashboardsSlice";

const NewDashboardForm = ({ onClose }) => {
  const [dashboardName, setDashboardName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await dispatch(asyncCreateNewDashboard({ dashboardName }))

      if (response.error) throw new Error(response.payload.message)

      // Getting the newest Dashboard from the state
      const newDashboard = response.payload.dashboard
      navigate(`./${newDashboard.id}`)
    } catch (error) {
      setErrorMessage(error.message)
    }

  }
  return (
    <form className="space-y-4 dark:text-black" onSubmit={handleSubmit}>
      <div className="space-y-2 flex flex-col">
        <label
          htmlFor="dashboard-name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Dashboard Name
        </label>
        <input
          id="dashboard-name"
          type="text"
          placeholder="Enter dashboard name"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
          onChange={(e) => setDashboardName(e.target.value)}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-sm text-destructive text-red-600">
          <svg 
            className="h-4 w-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Actions */}
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
          Create Dashboard
        </button>
      </div>
    </form>
  )
}

export default NewDashboardForm