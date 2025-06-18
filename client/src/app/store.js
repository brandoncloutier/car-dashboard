import { configureStore } from '@reduxjs/toolkit'

import resourcesReducer from '../features/resources/resourecesSlice'

export default configureStore({
  reducer: {
    resources: resourcesReducer
  }
})