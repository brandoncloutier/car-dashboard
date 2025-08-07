import { useParams } from "react-router"
import { useSelector } from "react-redux"
import { useState, useRef, useMemo, useEffect } from "react"
import { useEditModeContext } from "../../contexts/EditModeContext"
import { useGridDimensionsContext, GridDimensionsProvider } from "../../contexts/GridDimensionsContext"
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, KeyboardSensor, DragOverlay } from '@dnd-kit/core'
import { snapToGridRelativeTo, getSnappedPositionRelativeToContainer } from "../../utils/snapToGridHelperFunctions"
import { addDisplayComponentToDashboard } from "../../features/dashboards/dashboardsSlice"
import { useDispatch } from "react-redux"
import { Plus, X } from "lucide-react"

import MenuWidgetDraggable from "./MenuWidgetDraggable"
import PresentationalComponent from "./PresentationalComponent"
import DisplayComponent from "./DisplayComponent"
import { categorizedResourceComponentLibrary } from "../../utils/resourceComponentsLibrary"
import displayComponentsMenuLibrary from "../../utils/displayComponentsMenuLibrary"
import { createPortal } from "react-dom"

const Dashboard = () => {
  const { id } = useParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dashboard = useSelector(state => state.dashboards.dashboards.find(d => d.id === id))
  const { editMode } = useEditModeContext()

  if (!dashboard) return <div>No Dashboard Exists</div>

  return (
    <div className="flex flex-col h-full w-full">
      <GridDimensionsProvider>
        <DashboardGrid grid={dashboard.grid} dashboardId={dashboard.id} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </GridDimensionsProvider>
      {editMode ? createPortal(<Plus className='w-full h-full border-2 border-black dark:border-white rounded hover:bg-gray-200 hover:dark:bg-gray-700 hover:cursor-pointer' onClick={() => setIsMenuOpen(true)}/>, document.getElementById("sidebar-add-button-root")) : null}
    </div>
  )
}

const DashboardGrid = ({ dashboardId, isMenuOpen, setIsMenuOpen }) => {
  const [activeId, setActiveId] = useState(null)
  const containerRef = useRef(null)
  const nodeRefs = useRef(new Map())
  const [dragOriginRect, setDragOriginRect] = useState(null)
  const components = useSelector(state => state.dashboards.dashboards.find(dashboard => dashboard.id === dashboardId).components)
  const { editMode, setEditMode } = useEditModeContext()
  const { bestGridCellLayout } = useGridDimensionsContext()
  const dispatch = useDispatch()

  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor)
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  useEffect(() => {
    if (Object.keys(components).length === 0) {
      setIsMenuOpen(true)
      setEditMode(true)
    } else {
      setIsMenuOpen(false)
    }
  }, [dashboardId, components])

  const snapToGridModifier = useMemo(() => (
    snapToGridRelativeTo(
      containerRef,
      dragOriginRect,
      bestGridCellLayout?.cellWidth ?? 1,
      bestGridCellLayout?.cellHeight ?? 1
    )
  ), [containerRef, dragOriginRect, bestGridCellLayout?.cellWidth, bestGridCellLayout?.cellHeight])

  if (!bestGridCellLayout) return null

  const handleOnDragEnd = ({ delta, active }) => {
    const snapped = getSnappedPositionRelativeToContainer(
      containerRef,
      dragOriginRect,
      bestGridCellLayout.cellWidth,
      bestGridCellLayout.cellHeight,
      delta.x,
      delta.y
    )
    if (!snapped) return
    const { x, y } = snapped
    addComponent(active.id, x, y)
    setActiveId(null)
  }

  const addComponent = (componentReferenceId, positionX, positionY) => {
    const newId = crypto.randomUUID()

    dispatch(addDisplayComponentToDashboard({ dashboardId, newId, componentReferenceId, positionX, positionY }))
  }

  const handleOnDragStart = ({ active }) => {
    setIsMenuOpen(false)
    setActiveId(active.id)
    const node = nodeRefs.current.get(active.id)?.current
    setDragOriginRect(node ? node.getBoundingClientRect() : null)
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
      <Grid ref={containerRef} components={components} activeId={activeId} dashboardId={dashboardId} />
      <ComponentMenu nodeRefs={nodeRefs} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <DragOverlay modifiers={[snapToGridModifier]} dropAnimation={null} style={{ zIndex: 1 }}>
        {activeId && <PresentationalComponent id={activeId} />}
      </DragOverlay>
    </DndContext>
  )
}

const Grid = ({ ref, components, activeId, dashboardId }) => {
  const { bestGridCellLayout } = useGridDimensionsContext()

  useEffect(() => {
  }, [bestGridCellLayout])

  if (!bestGridCellLayout) return null

  return (
    <div
      ref={ref}
      className="w-full h-full absolute"
      style={activeId ? {
        backgroundSize: `${bestGridCellLayout.cellWidth}px ${bestGridCellLayout.cellHeight}px`,
        backgroundImage: `
          linear-gradient(to right, #4B5563 1px, transparent 1px),
          linear-gradient(to bottom, #4B5563 1px, transparent 1px)
        `
      } : null}
    >
      {Object.entries(components).map(([id, componentData]) => (
        <DisplayComponent key={id} id={id} componentData={componentData} dashboardId={dashboardId} />
      ))}
    </div>
  )
}

const ComponentMenu = ({ nodeRefs, isMenuOpen, setIsMenuOpen }) => {
  const { editMode } = useEditModeContext()

  return (
    <div className={`text-black w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl border ${isMenuOpen && editMode ? "z-[1]" : "z-[-9999]"}`}>
      <div className="flex items-center justify-between p-6 border-b">
        <h2 id="modal-title" className="text-lg font-semibold">
          Component Library
        </h2>
        <button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)} className="ml-auto h-8 w-8 p-0 hover:cursor-pointer" aria-label="Close modal">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[70vh]">
        <ul className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(displayComponentsMenuLibrary).map(([id, component]) => (
            <li key={id} className="flex flex-col items-center">
              <div className="mb-2 text-sm font-medium text-gray-700 capitalize">
                {component.name}
              </div>
              <MenuWidgetDraggable id={id} nodeRefs={nodeRefs} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard