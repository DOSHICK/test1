import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type FieldType = "text" | "number" | "date";

type FieldConfig = {
    name: string;
    label: string;
    type: FieldType;
};

const initialState: FieldConfig[] = JSON.parse(localStorage.getItem("fields") || "[]");

const fieldsSlice = createSlice({
    name: "fields",
    initialState,
    reducers: {
        setFields(state, action: PayloadAction<FieldConfig[]>) {
            return action.payload;
        },
        addField(state, action: PayloadAction<FieldConfig>) {
            state.push(action.payload);
        },
        updateField(state, action: PayloadAction<{ index: number; field: FieldConfig }>) {
            state[action.payload.index] = action.payload.field;
        },
        deleteField(state, action: PayloadAction<number>) {
            state.splice(action.payload, 1);
        }
    }
});

export const { setFields, addField, updateField, deleteField } = fieldsSlice.actions;
export default fieldsSlice.reducer;
