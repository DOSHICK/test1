import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { addItem, updateItemValues, deleteItem } from "../redux/itemsSlice";
import Item from "./Item";

const List: React.FC = () => {
  const itemsObj = useSelector((state: RootState) => state.items.items ?? {});
  const items = Object.values(itemsObj);
  const templates = useSelector((state: RootState) => state.templates ?? {});
  const dispatch = useDispatch<AppDispatch>();

  const [menuOpen, setMenuOpen] = useState(false);

  const templateKeys = Object.keys(templates);

  const handleAddItemFromTemplate = (templateKey: string) => {
    const tpl = templates[templateKey];
    const fields = tpl?.fields ?? [];
    const values = Object.fromEntries(fields.map((f: any) => [f.name, ""]));
    const objectTypeField = fields.find((f: any) => f.name === "object_type");
    const type = objectTypeField?.label || templateKey;

    dispatch(
      addItem({
        id: `item_${Date.now()}`,
        type,
        values,
      })
    );

    setMenuOpen(false);
  };

  return (
    <div className="p-4 flex flex-wrap gap-4 relative">
      {items.map((item: any) => (
        <Item
          key={item.id}
          type={item.type}
          values={item.values}
          onUpdate={(updated: any) =>
            dispatch(updateItemValues({ id: item.id, values: updated }))
          }
          onDelete={() => dispatch(deleteItem(item.id))}
        />
      ))}

      <div className="relative">
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="h-fit mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add new item
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-50">
            {templateKeys.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No templates</div>
            ) : (
              templateKeys.map((key) => {
                const tpl = templates[key];
                const objectTypeLabel =
                  tpl?.fields?.find((f: any) => f.name === "object_type")?.label ||
                  key;
                return (
                  <button
                    key={key}
                    onClick={() => handleAddItemFromTemplate(key)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Create {objectTypeLabel}
                  </button>
                );
              })
            )}
            <button
              onClick={() => setMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
