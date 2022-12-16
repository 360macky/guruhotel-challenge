import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { Business } from '../types/Business'

export interface appState {
  resultsSeen: string[]
  lastSearch: string
  latestResults: Business[]
  currentLocation: string
  isLocationCustom: boolean
}

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    // Storage the ids of the results that have been seen by the user.
    resultsSeen: [],
    // Storage the last search term.
    lastSearch: '',
    // Storage the results of the last search.
    latestResults: [],
    // Storage the current location.
    currentLocation: '',
    // Storage if the current location is customize by the user or not.
    isLocationCustom: false,
  },
  reducers: {
    resultsSeenAdd: (state: appState, action) => {
      state.resultsSeen.push(action.payload)
    },
    lastSearchUpdate: (state: appState, action) => {
      state.lastSearch = action.payload
    },
    latestResultsUpdate: (state: appState, action) => {
      state.latestResults = action.payload
    },
    currentLocationUpdate: (state: appState, action) => {
      state.currentLocation = action.payload
    },
    isLocationCustomUpdate: (state: appState, action) => {
      state.isLocationCustom = action.payload
    },
  },
})

const store = configureStore({
  reducer: appSlice.reducer,
})

export default store

export const appAction = appSlice.actions
