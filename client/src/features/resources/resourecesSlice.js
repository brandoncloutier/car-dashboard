import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  status: 'idle',
  resources_data: {},
  error: null
}

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    updateData(state, action) {
      state.resources_data = {
        ...state.resources_data,
        [action.payload.resource]: {value: action.payload.value, date: action.payload.date}
      }
    }
  },
  extraReducers(builder) {}
})

export const { updateData } = resourcesSlice.actions

export default resourcesSlice.reducer