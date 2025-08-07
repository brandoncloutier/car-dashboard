export const snapToGridRelativeTo = (containerRef, dragOriginRect, cellWidth, cellHeight) => {
  return ({ transform }) => {
    if (!containerRef.current || !dragOriginRect) return transform;

    const gridRect = containerRef.current.getBoundingClientRect();

    // Absolute pointer position
    const currentX = dragOriginRect.left + transform.x;
    const currentY = dragOriginRect.top + transform.y;

    // Position relative to container
    const relativeX = currentX - gridRect.left;
    const relativeY = currentY - gridRect.top;

    // Snap to grid using non-square cell size
    let snappedX = Math.round(relativeX / cellWidth) * cellWidth;
    let snappedY = Math.round(relativeY / cellHeight) * cellHeight;

    // Clamp to bounds
    snappedX = Math.max(0, snappedX);
    snappedY = Math.max(0, snappedY);

    // Convert back to transform space
    const offsetX = snappedX - (dragOriginRect.left - gridRect.left);
    const offsetY = snappedY - (dragOriginRect.top - gridRect.top);

    return {
      ...transform,
      x: offsetX,
      y: offsetY,
    };
  };
};


export const getSnappedPositionRelativeToContainer = (
  containerRef,
  dragOriginRect,
  cellWidth,
  cellHeight,
  deltaX,
  deltaY
) => {
  if (!containerRef.current || !dragOriginRect) return null;

  const gridRect = containerRef.current.getBoundingClientRect();

  // Absolute position with deltas
  const currentX = dragOriginRect.left + deltaX;
  const currentY = dragOriginRect.top + deltaY;

  // Relative to container
  const relativeX = currentX - gridRect.left;
  const relativeY = currentY - gridRect.top;

  // Snap to grid using non-square cell size
  let snappedX = Math.round(relativeX / cellWidth) * cellWidth;
  let snappedY = Math.round(relativeY / cellHeight) * cellHeight;

  // Clamp
  snappedX = Math.max(0, snappedX);
  snappedY = Math.max(0, snappedY);

  return { x: snappedX, y: snappedY };
};

