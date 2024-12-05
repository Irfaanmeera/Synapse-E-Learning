import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import enrolledCourseReducer from './enrolledCourseSlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage: localStorage for web
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Configure persist settings
const persistConfig = {
  key: 'user',  // Persist only the 'user' slice
  storage,      // Default is localStorage
};

// Wrap the user reducer with persistReducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistEnrolledCourseReducer = persistReducer(persistConfig, enrolledCourseReducer);
// Configure the store
const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Persisted reducer for the user slice
    enrolledCourse: persistEnrolledCourseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore redux-persist actions
        ignoredPaths: ['user'],  // Ignore user state for serializability check
      },
    }),
});

// Persistor to manage the store's persistence
export const persistor = persistStore(store);

// Define RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
