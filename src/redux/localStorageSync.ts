import type { Middleware } from "@reduxjs/toolkit";

export const localStorageSync: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  localStorage.setItem("fields", JSON.stringify(state.fields));
  return result;
};
