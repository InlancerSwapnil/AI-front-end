import { createAction } from "@reduxjs/toolkit";

export const setJwtToken = createAction<string>("SET_JWT_TOKEN");
export const setJwtExpired = createAction<number>("SET_JWT_EXPIRED");
export const setUserID = createAction<number>("SET_USER_ID");
export const setActiveChat = createAction<number>("SET_ACTIVE_CHAT");
export const setChatPending = createAction<boolean>("SET_CHAT_PENDING");
export const setNewChat = createAction<boolean>("SET_NEW_CHAT");
export const setIsChated = createAction<boolean>("SET_IS_CHATED");
export const setLastAiChatID = createAction<number>("SET_LAST_AI_CHAT_ID");
export const setLastUserChatID = createAction<number>("SET_LAST_USER_CHAT_ID");
