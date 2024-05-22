
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './services/apiSlice';
import authReducer from './features/authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses local storage by default

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth']  // Only persist the auth reducer
};  

const rootReducer = combineReducers({
	[apiSlice.reducerPath]: apiSlice.reducer,
	auth: authReducer
});
  
const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
	  getDefaultMiddleware({
		serializableCheck: {
		  ignoredActions: ['persist/PERSIST']
		}
	  }).concat(apiSlice.middleware),
	devTools: process.env.NODE_ENV !== 'production',
  });

export const persistor = persistStore(store); 

export const RootState = () => store.getState();
export const AppDispatch = store.dispatch;