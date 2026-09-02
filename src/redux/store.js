import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import inventoryReducer from './slices/inventorySlice'
import requestReducer from './slices/requestSlice'
import analyticsReducer from './slices/analyticsSlice'
import storefrontReducer from './slices/storefrontSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    request: requestReducer,
    analytics: analyticsReducer,
    storefront: storefrontReducer,
  },
})

export default store
