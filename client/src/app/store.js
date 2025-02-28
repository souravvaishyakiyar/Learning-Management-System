import { configureStore } from "@reduxjs/toolkit"; 

import rootReducer from "./rootReducer";
// import { authApi } from "./authApi"; // Adjust the import path as necessary
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";

import { courseProgressApi } from "@/features/api/courseProgressApi";
export const appStore = configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(authApi.middleware, courseApi.middleware,purchaseApi.middleware, courseProgressApi.middleware),   
      
    serializableCheck:false

});

const initializApp=async()=>{
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}));
}

initializApp();

