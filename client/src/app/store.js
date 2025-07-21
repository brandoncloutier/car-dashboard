import { configureStore } from '@reduxjs/toolkit'

import resourcesReducer from '../features/resources/resourecesSlice'
import dashboardsReducer from '../features/dashboards/dashboardsSlice'

export default configureStore({
  reducer: {
    resources: resourcesReducer,
    dashboards: dashboardsReducer
  }
})