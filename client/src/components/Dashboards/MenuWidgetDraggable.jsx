import { useEffect, useRef } from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useGridDimensionsContext } from "../../contexts/GridDimensionsContext"
import displayComponentsMenuLibrary from "../../utils/displayComponentsMenuLibrary"

const MenuWidgetDraggable = ({ id, nodeRefs }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const localRef = useRef(null)
  const component = displayComponentsMenuLibrary[id]
  const { bestGridCellLayout } = useGridDimensionsContext()
  const { cols, rows, cellWidth, cellHeight } = bestGridCellLayout

  useEffect(() => {
    nodeRefs.current.set(id, localRef)
    return () => nodeRefs.current.delete(id)
  }, [id])

  // Preview bounding box
  const maxPreviewWidth = 150
  const maxPreviewHeight = 100

  const computeSize = (dimension, total) =>
    dimension.type === "value" ? dimension.value : dimension.value * total

  const thisComponentWidth = computeSize(component.width, cols)
  const thisComponentHeight = computeSize(component.height, rows)

  // Determine the max width/height (in cells) from the whole library
  const maxGridWidth = Math.max(
    ...Object.values(displayComponentsMenuLibrary).map(c => computeSize(c.width, cols))
  )
  const maxGridHeight = Math.max(
    ...Object.values(displayComponentsMenuLibrary).map(c => computeSize(c.height, rows))
  )

  // Normalize to preview space
  const previewWidth = (thisComponentWidth / maxGridWidth) * maxPreviewWidth
  const previewHeight = (thisComponentHeight / maxGridHeight) * maxPreviewHeight

  const blockPreviewStyle = {
    width: `${previewWidth}px`,
    height: `${previewHeight}px`,
  }

  const style = {
    transform: CSS.Translate.toString({
      x: transform?.x ?? 0,
      y: transform?.y ?? 0,
    })
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`border-2 rounded bg-gray-200 w-[150px] h-[100px] overflow-hidden text-[10px] ${isDragging ? "opacity-0" : ""
          }`}
        ref={node => {
          setNodeRef(node)
          localRef.current = node
        }}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div
        className="bg-blue-300 border rounded-xs"
        style={blockPreviewStyle}>
        </div>
      </div>
    </div>
  )
}

export default MenuWidgetDraggable