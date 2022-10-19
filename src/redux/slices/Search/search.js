import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: '',
}

export const search = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.text = action.payload
    },
  },
})

export const { setSearch } = search.actions

export default search.reducer
