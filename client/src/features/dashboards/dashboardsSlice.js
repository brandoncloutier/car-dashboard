import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const asyncCreateNewDashboard = createAsyncThunk(
  'dashboards/asyncCreateNewDashboard',
  async ({ dashboardName }, { dispatch, getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const currentDashboards = getState().dashboards.dashboards

      const dashboardAlreadyExists = currentDashboards.some(
        dashboard => dashboard.name === dashboardName
      );

      if (dashboardAlreadyExists) {
        return rejectWithValue({
          success: false,
          message: "Dashboard name already exists",
        });
      }

      const id = crypto.randomUUID()

      dispatch(createDashboard({ id, dashboardName }));

      return fulfillWithValue({
        success: true,
        message: "New dashboard created",
        dashboard: {
          id: id,
          name: dashboardName
        }
      });
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || "An error occurred while creating the dashboard",
      });
    }
  }
)

const dashboards = JSON.parse(localStorage.getItem("dashboardsState"))

const initialState = {
  status: 'idle',
  dashboards: dashboards || [],
  error: null
}

const dashboardsSlice = createSlice({
  name: "dashboards",
  initialState,
  reducers: {
    createDashboard(state, action) {
      const newDashboardsState = state.dashboards.concat({
        id: action.payload.id,
        name: action.payload.dashboardName,
        grid: []
      })
      state.dashboards = newDashboardsState

      localStorage.setItem("dashboardsState", JSON.stringify(newDashboardsState))
      return
    },
    deleteDashboard(state, action) {
      const newDashboardsState = state.dashboards.filter(dashboard => dashboard.id !== action.payload)
      state.dashboards = newDashboardsState

      localStorage.setItem("dashboardsState", JSON.stringify(newDashboardsState))
      return
    },
    addComponentToDashboard(state, action) {
      const { dashboardId, gridRowIndex, chosenComponentId } = action.payload;
      const targetDashboard = state.dashboards.find((dashboard) => dashboard.id === dashboardId);

      if (!targetDashboard) return;

      // Make a deep copy of the grid
      const targetGridCopy = targetDashboard.grid.map(row => [...row]);

      // Ensure enough rows exist
      while (targetGridCopy.length <= gridRowIndex) {
        targetGridCopy.push([]);
      }

      // Add component to the specified row
      targetGridCopy[gridRowIndex].push(chosenComponentId);

      // Update dashboard's grid
      targetDashboard.grid = targetGridCopy;

      // Persist the new dashboards state
      localStorage.setItem("dashboardsState", JSON.stringify(state.dashboards));
    },
    deleteComponentFromDashboard(state, action) {
      const { dashboardId, gridRowIndex, gridColIndex } = action.payload;

      const targetDashboard = state.dashboards.find(d => d.id === dashboardId);
      if (!targetDashboard || !targetDashboard.grid[gridRowIndex]) return;

      const updatedGrid = [...targetDashboard.grid];
      const updatedRow = [...updatedGrid[gridRowIndex]];
      updatedRow.splice(gridColIndex, 1);
      if (updatedRow.length <= 0) {
        updatedGrid.splice(gridRowIndex, 1)
      } else {
        updatedGrid[gridRowIndex] = updatedRow;
      }
      targetDashboard.grid = updatedGrid;

      localStorage.setItem("dashboardsState", JSON.stringify(state.dashboards));
    }
  },
  extraReducers(builder) { }
})

export const { createDashboard, deleteDashboard, addComponentToDashboard, deleteComponentFromDashboard } = dashboardsSlice.actions

export default dashboardsSlice.reducer

export const selectDashboards = state => state.dashboards.dashboards