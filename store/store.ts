import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { Business } from '../types/Business'

export interface appState {
  results: Business[]
  resultsSeen: string[]
  lastSearch: string
  latestResults: Business[]
  currentLocation: string
}

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    results: [],
    resultsSeen: [],
    lastSearch: '',
    latestResults: [],
    currentLocation: '',
  },
  reducers: {
    resultsUpdate: (state: appState, action) => {
      state.results = action.payload
    },
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
  },
})

const store = configureStore({
  reducer: appSlice.reducer,
})

export default store

export const appAction = appSlice.actions
