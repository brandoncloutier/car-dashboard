import { useGridDimensionsContext } from "../../contexts/GridDimensionsContext"
import displayComponentsMenuLibrary from "../../utils/displayComponentsMenuLibrary"
import { deleteDisplayComponentFromDashboard, setResourceComponentForDisplayComponent } from "../../features/dashboards/dashboardsSlice"
import { useDispatch } from "react-redux"
import { useEditModeContext } from "../../contexts/EditModeContext"
import { useState } from "react"
import { X, Plus } from "lucide-react"
import Modal from "../Modal/Modal"
import { categorizedResourceComponentLibrary, resourceComponentMap } from "../../utils/resourceComponentsLibrary"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

const DisplayComponent = ({ dashboardId, id, componentData }) => {
  const { bestGridCellLayout } = useGridDimensionsContext()
  const { referenceId, position, resourceComponentId } = componentData
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { editMode } = useEditModeContext()

  const handleExitClick = (event) => {
    event.stopPropagation()
    event.preventDefault()
    setIsModalOpen(true)
  }

  const { cols, rows, cellWidth, cellHeight } = bestGridCellLayout
  const componentConfig = displayComponentsMenuLibrary[referenceId]

  if (!componentConfig) {
    return (
      <div
        className="absolute border bg-red-400 text-white p-2"
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
      >
        Unknown component: {referenceId}
      </div>
    )
  }

  const computeSize = (dimension, total, cellSize) => {
    return dimension.type === "value"
      ? dimension.value * cellSize
      : dimension.value * total * cellSize
  }

  const width = computeSize(componentConfig.width, cols, cellWidth)
  const height = computeSize(componentConfig.height, rows, cellHeight)

  const style = {
    top: `${position.y}px`,
    left: `${position.x}px`,
    width: `${width}px`,
    height: `${height}px`,
  }

  return (
    <div
      className="absolute p-1"
      style={style}
    >
      {resourceComponentId ? <ResourceComponent resourceComponentId={resourceComponentId} /> : <AddComponentButton handleExitClick={handleExitClick} dashboardId={dashboardId} componentId={id} />}

      {editMode ? <button className="absolute top-[10px] right-[10px] bg-red-600 rounded-full hover:cursor-pointer p-[2px]" onClick={handleExitClick}><X className="h-5 w-5 text-white" /></button> : null}

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm" title="Delete Component">
        <ConfirmDeleteButtons onClose={() => setIsModalOpen(false)} componentId={id} dashboardId={dashboardId} />
      </Modal>
    </div>
  )
}

const ConfirmDeleteButtons = ({ onClose, componentId, dashboardId }) => {
  const dispatch = useDispatch()
  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(deleteDisplayComponentFromDashboard({ dashboardId, componentId }))
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
          Delete Component
        </button>
      </div>
    </form>
  )
}

const AddComponentButton = ({ handleExitClick, dashboardId, componentId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { editMode } = useEditModeContext()

  const handleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div onClick={handleClick} className="relative h-full w-full rounded bg-gray-300 dark:bg-gray-800 border border-gray-500 flex justify-center items-center hover:bg-gray-400 hover:dark:bg-gray-700 hover:cursor-pointer">
        <Plus className="w-10 h-10" />
      </div>

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl" title="Add Component ">
        <ResourceComponentsMenu dashboardId={dashboardId} componentId={componentId} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}

const ResourceComponentsMenu = ({ dashboardId, componentId, onClose }) => {
  const [chosenResourceComponentId, setChosenResourceComponentId] = useState(null)
  const dispatch = useDispatch()

  const handleResourceComponentClick = (id) => {
    setChosenResourceComponentId(id)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!chosenResourceComponentId) return

    const payload = {
      dashboardId,
      componentId,
      resourceComponentId: chosenResourceComponentId
    }

    dispatch(setResourceComponentForDisplayComponent(payload))
  }
  return (
    <form className="p-4" onSubmit={handleSubmit}>
      {Object.entries(categorizedResourceComponentLibrary).map(([category, resourceComponents]) => (
        <div key={category} className="mb-6">
          <h2 className="text-xl font-bold mb-2 capitalize">{category}</h2>
          <ul className="pl-4 list-disc flex gap-2">
            {resourceComponents.map((item) => (
              <li key={item.id} className={`mb-1 border p-4 hover:cursor-pointer ${chosenResourceComponentId === item.id ? "bg-green-200" : null}`} onClick={() => handleResourceComponentClick(item.id)}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
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
          disabled={chosenResourceComponentId === null}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-primary/90 h-10 px-4 py-2 hover:cursor-pointer"
        >
          Fill Component
        </button>
      </div>
    </form>
  );
}

const ResourceComponent = ({ resourceComponentId }) => {
  const { editMode } = useEditModeContext()
  return (
    <div className={`relative h-full w-full rounded ${editMode ? "border-1" : null}`}>{resourceComponentMap[resourceComponentId]}</div>
  )
}

export default DisplayComponent