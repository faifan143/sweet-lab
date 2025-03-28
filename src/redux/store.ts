// store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./reducers/userSlice";
import wrapperReducer from "./reducers/wrapper.slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  wrapper: wrapperReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// First, let's fix your store.ts - keep your existing configuration but make this small change:
export const store = configureStore({
  reducer: {
    user: persistedReducer,
    wrapper: wrapperReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
