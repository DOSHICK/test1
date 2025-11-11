import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "./itemsSlice";
import templatesReducer from "./templatesSlice";

const loadFromLocalStorage = <T,>(key: string): T | undefined => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
};

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

const loadItemsState = (): { items: Record<string, any> } => {
  try {
    const raw = loadFromLocalStorage<any>("items");
    if (!raw) return { items: {} };

    if (raw.items && typeof raw.items === "object" && !Array.isArray(raw.items)) {
      return { items: raw.items };
    }

    if (Array.isArray(raw)) {
      const map: Record<string, any> = {};
      raw.forEach((it) => {
        if (it && it.id) map[it.id] = it;
      });
      return { items: map };
    }

    if (typeof raw === "object") {
      const vals = Object.values(raw);
      if (vals.length === 0 || vals.every((v) => v && v.id)) {
        return { items: raw };
      }
    }

    return { items: {} };
  } catch {
    return { items: {} };
  }
};

const templatesRaw = loadFromLocalStorage("templates") ?? {};

const preloadedState = {
  templates: templatesRaw,
  items: loadItemsState(),
};

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    templates: templatesReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((storeAPI) => (next) => (action) => {
      const result = next(action);
      const state = storeAPI.getState();
      saveToLocalStorage("items", state.items);
      saveToLocalStorage("templates", state.templates);
      return result;
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
