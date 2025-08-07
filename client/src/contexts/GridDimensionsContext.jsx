import { createContext, useContext, useState, useRef, useEffect } from "react"

const getBestGridCellLayout = (X, Y) => {
  let best = null;

  for (let cols = 2; cols <= Math.floor(X / 90); cols += 2) {
    const cellWidth = X / cols;
    if (cellWidth < 90) continue;

    for (let rows = 2; rows <= Math.floor(Y / 90); rows += 2) {
      const cellHeight = Y / rows;
      if (cellHeight < 90) continue;

      const deviation = Math.abs(cellWidth - 90) + Math.abs(cellHeight - 90);

      if (!best || deviation < best.deviation) {
        best = {
          cols,
          rows,
          cellWidth: Math.round(cellWidth * 100) / 100,
          cellHeight: Math.round(cellHeight * 100) / 100,
          deviation
        };
      }
    }
  }

  return best;
};

const GridDimensionsContext = createContext()

export const GridDimensionsProvider = ({ children }) => {
  const [bestGridCellLayout, setBestGridCellLayout] = useState(null)
  const containerRef = useRef(null)

  const handleSetBestGridCellLayout = (X, Y) => {
    const bestLayout = getBestGridCellLayout(X, Y)
    setBestGridCellLayout(bestLayout)
  }

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth: width, clientHeight: height } = containerRef.current
      handleSetBestGridCellLayout(width, height)
    }
  }, [])

  const value = {
    handleSetBestGridCellLayout,
    bestGridCellLayout,
    containerRef
  }

  return (
    <GridDimensionsContext.Provider value={value}>
      <div className="relative flex justify-center items-center grow" ref={containerRef}>
        {children}
      </div>
    </GridDimensionsContext.Provider>
  )
}

export const useGridDimensionsContext = () => useContext(GridDimensionsContext)