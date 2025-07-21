import { categorizedComponentLibrary } from "../../utils/componentsLibrary"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { addComponentToDashboard } from "../../features/dashboards/dashboardsSlice"

const AddFromComponentLibraryForm = ({ onClose, dashboardId, gridRowIndex }) => {
  const [chosenComponentId, setChosenComponent] = useState(null)

  const dispatch = useDispatch()

  const handleClick = (resourceId) => {
    setChosenComponent(resourceId)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(addComponentToDashboard({ dashboardId, gridRowIndex, chosenComponentId }))
    onClose()
  }

  return (
    <form onSubmit={handleSubmit}>
      <ul>
        {Object.entries(categorizedComponentLibrary).map(([category, resources]) => {
          return (
            <div key={category}>
              <div className="py-2 text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">{category}</div>
              <div className="flex gap-2 flex-wrap">
                {resources.map(resource => {
                  return <div
                    className={`p-4 border box-border hover:cursor-pointer ${chosenComponentId === resource.id ? "border-black" : "border-transparent"}`}
                    onClick={() => handleClick(resource.id)}
                    key={resource.id}
                  >
                    {resource.name}
                  </div>
                })}
              </div>
            </div>
          )
        })}
      </ul>

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
          Add Component
        </button>
      </div>
    </form>
  )
}

export default AddFromComponentLibraryForm