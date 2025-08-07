import { useGridDimensionsContext } from "../../contexts/GridDimensionsContext"
import displayComponentsMenuLibrary from "../../utils/displayComponentsMenuLibrary";
import { Plus } from "lucide-react";

const PresentationalComponent = ({ id }) => {
  const { bestGridCellLayout } = useGridDimensionsContext();

  const { cols, rows, cellWidth, cellHeight } = bestGridCellLayout;
  const componentConfig = displayComponentsMenuLibrary[id];

  if (!componentConfig) return <div>Unknown component ID</div>;

  const computeSize = (dimension, total, cellSize) => {
    if (dimension.type === "value") {
      return dimension.value * cellSize;
    } else if (dimension.type === "ratio") {
      return dimension.value * total * cellSize;
    }
    return 0;
  };

  const width = computeSize(componentConfig.width, cols, cellWidth);
  const height = computeSize(componentConfig.height, rows, cellHeight);

  return (
    <div
      className="p-1"
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      <AddComponentButton />
    </div>
  );
};

const AddComponentButton = () => {
  return (
    <div className="h-full w-full rounded bg-gray-300 dark:bg-gray-800 border border-gray-500 flex justify-center items-center">
      <Plus className="w-10 h-10" />
    </div>
  )
}

export default PresentationalComponent;