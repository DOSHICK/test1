// src/redux/templatesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addPage } from "./pagesSlice";

export type FieldType = "text" | "number" | "date" | string;

export type FieldConfig = {
  name: string;
  label?: string;
  type?: FieldType;
  default?: any;
};

export type Template = {
  key: string;
  label?: string;
  fields?: FieldConfig[];
  systemFields?: FieldConfig[];
};

interface TemplatesState {
  templates: Record<string, Template>;
}

const initialState: TemplatesState = {
  templates: {},
};

const ensureTemplateObject = (state: TemplatesState, key?: string): Template => {
  const k = key ?? "undefined";
  state.templates = state.templates ?? {};
  let tpl = state.templates[k];
  if (!tpl || typeof tpl === "string") {
    tpl = { key: k, label: typeof tpl === "string" ? tpl : k, fields: [], systemFields: [] };
    state.templates[k] = tpl;
  } else {
    tpl.fields = tpl.fields ?? [];
    tpl.systemFields = tpl.systemFields ?? [];
  }
  return tpl;
};

const templatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    addTemplate(state, action: PayloadAction<Template>) {
      state.templates = state.templates ?? {};
      const key = (action.payload.key && String(action.payload.key).trim()) || `template_${Date.now()}`;
      state.templates[key] = {
        key,
        label: action.payload.label ?? key,
        fields: action.payload.fields ?? [],
        systemFields: action.payload.systemFields ?? [],
      };
    },

    updateTemplate(state, action: PayloadAction<Template>) {
      state.templates = state.templates ?? {};
      const key = action.payload.key || `template_${Date.now()}`;
      state.templates[key] = {
        key,
        label: action.payload.label ?? key,
        fields: action.payload.fields ?? [],
        systemFields: action.payload.systemFields ?? [],
      };
    },

    removeTemplate(state, action: PayloadAction<string>) {
      if (state.templates && state.templates[action.payload]) {
        delete state.templates[action.payload];
      }
    },

    // alias для совместимости с импортами deleteTemplate
    deleteTemplate(state, action: PayloadAction<string>) {
      if (state.templates && state.templates[action.payload]) {
        delete state.templates[action.payload];
      }
    },

    // addField поддерживает payload { type, field } или { templateKey, field }
    addField(state, action: PayloadAction<{ type?: string; templateKey?: string; field: FieldConfig }>) {
      const key = action.payload.templateKey ?? action.payload.type;
      const tpl = ensureTemplateObject(state, key);
      const field = action.payload.field;
      if (!tpl.fields!.some((f) => f.name === field.name) && !tpl.systemFields!.some((f) => f.name === field.name)) {
        tpl.fields!.push(field);
      }
    },

    // updateField поддерживает { type, index, field } и { type, fieldName, patch }
    updateField(
      state,
      action: PayloadAction<{
        type?: string;
        templateKey?: string;
        index?: number;
        field?: FieldConfig;
        fieldName?: string;
        patch?: Partial<FieldConfig>;
      }>
    ) {
      const key = action.payload.templateKey ?? action.payload.type;
      const tpl = ensureTemplateObject(state, key);

      if (typeof action.payload.index === "number" && action.payload.field) {
        const idx = action.payload.index;
        if (idx >= 0 && idx < tpl.fields!.length) {
          tpl.fields![idx] = { ...tpl.fields![idx], ...action.payload.field };
        }
        return;
      }

      if (action.payload.fieldName && action.payload.patch) {
        const name = action.payload.fieldName;
        const idx = tpl.fields!.findIndex((f) => f.name === name);
        if (idx !== -1) {
          tpl.fields![idx] = { ...tpl.fields![idx], ...action.payload.patch };
          return;
        }
        const sidx = tpl.systemFields!.findIndex((f) => f.name === name);
        if (sidx !== -1) {
          tpl.systemFields![sidx] = { ...tpl.systemFields![sidx], ...action.payload.patch };
        }
      }
    },

    // deleteField поддерживает { type, index } и { type, fieldName }
    deleteField(state, action: PayloadAction<{ type?: string; templateKey?: string; index?: number; fieldName?: string }>) {
      const key = action.payload.templateKey ?? action.payload.type;
      const tpl = ensureTemplateObject(state, key);

      if (typeof action.payload.index === "number") {
        const idx = action.payload.index;
        if (idx >= 0 && idx < tpl.fields!.length) tpl.fields!.splice(idx, 1);
        return;
      }

      if (action.payload.fieldName) {
        const name = action.payload.fieldName;
        tpl.fields = tpl.fields!.filter((f) => f.name !== name);
        tpl.systemFields = tpl.systemFields!.filter((f) => f.name !== name);
      }
    },

    // system fields API если понадобится отдельно
    addSystemField(state, action: PayloadAction<{ type?: string; templateKey?: string; field: FieldConfig }>) {
      const key = action.payload.templateKey ?? action.payload.type;
      const tpl = ensureTemplateObject(state, key);
      const field = action.payload.field;
      if (!tpl.systemFields!.some((f) => f.name === field.name) && !tpl.fields!.some((f) => f.name === field.name)) {
        tpl.systemFields!.push(field);
      }
    },

    updateSystemField(
      state,
      action: PayloadAction<{ type?: string; templateKey?: string; fieldName: string; patch: Partial<FieldConfig> }>
    ) {
      const key = action.payload.templateKey ?? action.payload.type;
      const tpl = ensureTemplateObject(state, key);
      const idx = tpl.systemFields!.findIndex((f) => f.name === action.payload.fieldName);
      if (idx !== -1) tpl.systemFields![idx] = { ...tpl.systemFields![idx], ...action.payload.patch };
    },

    removeSystemField(state, action: PayloadAction<{ type?: string; templateKey?: string; fieldName: string }>) {
      const key = action.payload.templateKey ?? action.payload.type;
      const tpl = ensureTemplateObject(state, key);
      tpl.systemFields = tpl.systemFields!.filter((f) => f.name !== action.payload.fieldName);
    },
  },
});

export const {
  addTemplate,
  updateTemplate,
  removeTemplate,
  deleteTemplate,
  addField,
  updateField,
  deleteField,
  addSystemField,
  updateSystemField,
  removeSystemField,
} = templatesSlice.actions;

// thunk для совместимости с предыдущей логикой создания страницы при добавлении шаблона
export const addTemplateAndCreatePage = createAsyncThunk<Template, Template, { state: any; rejectValue: string }>(
  "templates/addTemplateAndCreatePage",
  async (template, thunkAPI) => {
    thunkAPI.dispatch(addTemplate(template));
    try {
      const objectTypeField = template.fields?.find((f) => f.name === "object_type");
      const objectType = objectTypeField?.label ?? template.key;
      const pageId = `page_${Date.now()}`;
      const page = {
        id: pageId,
        title: `Items ${objectType}`,
        path: `/items/type/${encodeURIComponent(objectType)}`,
        filter: { type: objectType },
      };
      await new Promise((res) => setTimeout(res, 80));
      thunkAPI.dispatch(addPage(page));
      return template;
    } catch {
      return thunkAPI.rejectWithValue("Failed to create page for template");
    }
  }
);

export default templatesSlice.reducer;
