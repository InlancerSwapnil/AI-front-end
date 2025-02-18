import { configureStore } from "@reduxjs/toolkit";
import { authReducer, userReducer, chatReducer } from "@/redux/reducers";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
  },
});

export default store;
