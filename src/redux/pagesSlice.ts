import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Page = {
  id: string;
  title: string;
  path: string;
  filter?: Record<string, any>;
};

interface PagesState {
  pages: Record<string, Page>;
}

const initialState: PagesState = {
  pages: {},
};

const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    addPage(state, action: PayloadAction<Page>) {
      state.pages = state.pages ?? {};
      state.pages[action.payload.id] = action.payload;
    },
    removePage(state, action: PayloadAction<string>) {
      if (state.pages && state.pages[action.payload]) {
        delete state.pages[action.payload];
      }
    },
    updatePage(state, action: PayloadAction<Page>) {
      state.pages = state.pages ?? {};
      state.pages[action.payload.id] = action.payload;
    },
  },
});

export const { addPage, removePage, updatePage } = pagesSlice.actions;
export default pagesSlice.reducer;
