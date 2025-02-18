import { createReducer } from "@reduxjs/toolkit";
import { setUserID } from "@/redux/actions";

interface AuthState {
  userID: number;
}

const initialState: AuthState = {
  userID: 0,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUserID, (state, action) => {
    state.userID = action.payload;
  });
});
