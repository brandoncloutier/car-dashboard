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
        components: {}
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
    addDisplayComponentToDashboard(state, action) {
      const { dashboardId, newId, componentReferenceId, positionX, positionY } = action.payload;

      // Find the target dashboard
      const dashboard = state.dashboards.find(d => d.id === dashboardId);
      if (!dashboard) return;

      // Create a new component entry
      const newDisplayComponent = {
        id: newId,
        referenceId: componentReferenceId,
        resourceComponentId: null,
        position: {
          x: positionX,
          y: positionY
        }
      };

      // Add the new component to the components map
      dashboard.components[newId] = newDisplayComponent;

      // Persist the new dashboards state
      localStorage.setItem("dashboardsState", JSON.stringify(state.dashboards));
    },
    deleteDisplayComponentFromDashboard(state, action) {
      const { dashboardId, componentId } = action.payload;

      // Find the target dashboard
      const dashboard = state.dashboards.find(d => d.id === dashboardId);
      if (!dashboard) return;

      // Delete the component from the components map
      delete dashboard.components[componentId];

      // Persist the new dashboards state
      localStorage.setItem("dashboardsState", JSON.stringify(state.dashboards));
    },
    setResourceComponentForDisplayComponent(state, action) {
      const { dashboardId, componentId, resourceComponentId } = action.payload;

      // Find the target dashboard
      const dashboard = state.dashboards.find(d => d.id === dashboardId);
      if (!dashboard) return;

      // Find the target component
      const component = dashboard.components[componentId];
      if (!component) return;

      // Update the resourceComponentId
      component.resourceComponentId = resourceComponentId;

      // Persist the new dashboards state
      localStorage.setItem("dashboardsState", JSON.stringify(state.dashboards));
    }
  },
  extraReducers(builder) { }
})

export const { createDashboard, deleteDashboard, addDisplayComponentToDashboard, deleteDisplayComponentFromDashboard, setResourceComponentForDisplayComponent } = dashboardsSlice.actions

export default dashboardsSlice.reducer

export const selectDashboards = state => state.dashboards.dashboards