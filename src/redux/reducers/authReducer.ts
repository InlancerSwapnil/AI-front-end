import { createReducer } from "@reduxjs/toolkit";
import { setJwtToken, setJwtExpired } from "@/redux/actions";
import Cookies from "universal-cookie";

const cookies = new Cookies();

interface AuthState {
  jwtToken: string;
  expired_at: number;
}

const initialState: AuthState = {
  jwtToken: cookies.get("jwtToken") || "",
  expired_at: parseInt(cookies.get("expired_at") || "0"),
};

export const authReducer = createReducer(initialState, (builder) => {
  builder.addCase(setJwtToken, (state, action) => {
    state.jwtToken = action.payload;
    cookies.set("jwtToken", action.payload, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  });

  builder.addCase(setJwtExpired, (state, action) => {
    state.expired_at = action.payload;
    cookies.set("expired_at", action.payload.toString(), {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  });
});
