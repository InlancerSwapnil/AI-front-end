import { createReducer } from "@reduxjs/toolkit";
import {
  setActiveChat,
  setChatPending,
  setNewChat,
  setIsChated,
} from "@/redux/actions";

interface AuthState {
  activeChat: number;
  chatPending: boolean;
  isNewChat?: boolean;
  isChated: boolean;
}

const initialState: AuthState = {
  activeChat: 0,
  chatPending: false,
  isNewChat: false,
  isChated: false,
};

export const chatReducer = createReducer(initialState, (builder) => {
  builder.addCase(setActiveChat, (state, action) => {
    state.activeChat = action.payload;
  });
  builder.addCase(setChatPending, (state, action) => {
    state.chatPending = action.payload;
  });
  builder.addCase(setNewChat, (state, action) => {
    state.isNewChat = action.payload;
  });
  builder.addCase(setIsChated, (state, action) => {
    state.isChated = action.payload;
  });
});
