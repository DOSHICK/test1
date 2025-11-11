import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ItemData = {
  id: string;
  type: string;
  values: Record<string, string | number | Date>;
};

export type TemplateField = {
  name: string;
  label?: string;
  default?: any;
};

export type Template = {
  fields?: TemplateField[];
};

interface ItemsState {
  items: Record<string, ItemData>;
}

const initialState: ItemsState = {
  items: {},
};

// helper: найти шаблон по item.type (сопоставляет и по ключу, и по object_type.label)
const findTemplateForItem = (
  templates: Record<string, Template> | undefined,
  itemType?: string
): Template | undefined => {
  if (!templates || !itemType) return undefined;

  // прямое совпадение ключа
  if (templates[itemType]) return templates[itemType];

  // иначе ищем шаблон, у которого поле object_type имеет label === itemType
  for (const tpl of Object.values(templates)) {
    const objField = tpl.fields?.find((f) => f.name === "object_type");
    if (objField && objField.label === itemType) return tpl;
  }

  return undefined;
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<ItemData>) {
      if (!state.items || typeof state.items !== "object") state.items = {};
      state.items[action.payload.id] = action.payload;
    },

    updateItemValues(
      state,
      action: PayloadAction<{ id: string; values: Partial<ItemData["values"]> }>
    ) {
      const item = state.items?.[action.payload.id];
      if (item) {
        item.values = { ...item.values, ...action.payload.values };
      }
    },

    updateItemType(
      state,
      action: PayloadAction<{ id: string; type: string }>
    ) {
      const item = state.items?.[action.payload.id];
      if (item) {
        item.type = action.payload.type;
      }
    },

    deleteItem(state, action: PayloadAction<string>) {
      if (state.items && state.items[action.payload]) {
        delete state.items[action.payload];
      }
    },

    // Синхронизация существующих items с текущими шаблонами
    // payload: Record<string, Template>
    syncWithTemplates(state, action: PayloadAction<Record<string, Template>>) {
      const templates = action.payload || {};
      Object.values(state.items ?? {}).forEach((item) => {
        const tpl = findTemplateForItem(templates, item.type);
        const fields = tpl?.fields ?? [];
        const allowed = new Set(fields.map((f) => f.name));

        item.values = item.values ?? {};

        // добавить недостающие поля с дефолтами
        fields.forEach((f) => {
          if (!(f.name in item.values)) {
            item.values[f.name] = f.default ?? "";
          }
        });

        // удалить лишние ключи (опционально — можно убрать этот блок, если нужно сохранять старые данные)
        Object.keys(item.values).forEach((k) => {
          if (!allowed.has(k)) delete item.values[k];
        });
      });
    },
  },
});

export const {
  addItem,
  updateItemValues,
  updateItemType,
  deleteItem,
  syncWithTemplates,
} = itemsSlice.actions;

export default itemsSlice.reducer;
