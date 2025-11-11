import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import {
  addField,
  updateField,
  deleteField,
  // setObjectTitle,
} from "../redux/templatesSlice";
import type { FieldConfig, FieldType } from "../redux/templatesSlice";

type Props = {
  type: string; // internal template key
};

const ItemChanger: React.FC<Props> = ({ type }) => {
  const template = useSelector((s: RootState) => s.templates[type]);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const fields: FieldConfig[] = template?.fields || [];
//   const objectTitleName = template?.objectTitle || "";

  // system fields are visible and editable like normal fields but visually separated
  const systemFields = fields.filter(f => f.name === "object_type" || f.name === "object_title");
  const userFields = fields.filter(f => f.name !== "object_type" && f.name !== "object_title");

  const objectTypeLabel = useMemo(() => {
    const f = fields.find(x => x.name === "object_type");
    return f?.label || "Unnamed";
  }, [fields]);

  const handleUpdateLabel = (index: number, newLabel: string) => {
    const f = fields[index];
    if (!f) return;
    const updated: FieldConfig = { ...f, label: newLabel };
    dispatch(updateField({ type, index, field: updated }));
  };

  const handleUpdateType = (index: number, newType: FieldType) => {
    const f = fields[index];
    if (!f) return;
    const updated: FieldConfig = { ...f, type: newType };
    dispatch(updateField({ type, index, field: updated }));
  };

  const handleDelete = (index: number) => {
    dispatch(deleteField({ type, index }));
  };

  const handleAddField = (fieldType: FieldType) => {
    const idx = fields.length + 1;
    const defaultName = `field_${idx}`;
    const field: FieldConfig = { name: defaultName, label: defaultName, type: fieldType };
    dispatch(addField({ type, field }));
    setMenuOpen(false);
  };

//   const handleSetObjectTitle = (fieldName: string) => {
//     dispatch(setObjectTitle({ type, fieldName }));
//   };

  return (
    <div className="bg-amber-100 border border-amber-700 p-3 w-full max-w-md relative">
      <h3 className="text-lg font-bold mb-2">Template: {objectTypeLabel}</h3>

      <div className="mb-3">
        <h4 className="font-semibold text-sm mb-1 text-gray-700">System fields</h4>
        {systemFields.map((field) => {
          const idx = fields.indexOf(field);
          return (
            <div key={field.name} className="mb-2 flex gap-2 items-center">
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleUpdateLabel(idx, e.target.value)}
                placeholder="Label"
                className="border px-2 py-1 w-1/2"
              />
              <select
                value={field.type}
                onChange={(e) => handleUpdateType(idx, e.target.value as FieldType)}
                className="border px-2 py-1 w-1/3"
              >
                <option value="text">Small text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
            </div>
          );
        })}
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-sm mb-1 text-gray-700">Fields</h4>
        {userFields.map((field) => {
          const idx = fields.indexOf(field);
          return (
            <div key={field.name} className="mb-2 flex gap-2 items-center">
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleUpdateLabel(idx, e.target.value)}
                placeholder="Field label"
                className="border px-2 py-1 w-1/3"
              />
              <select
                value={field.type}
                onChange={(e) => handleUpdateType(idx, e.target.value as FieldType)}
                className="border px-2 py-1 w-1/3"
              >
                <option value="text">Small text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      {/* <div className="mb-2">
        <label className="font-bold mr-2">Object title</label>
        <select
          value={objectTitleName}
          onChange={(e) => handleSetObjectTitle(e.target.value)}
          className="border px-2 py-1"
        >
          {fields.map(f => (
            <option key={f.name} value={f.name}>
              {f.label || f.name}
            </option>
          ))}
        </select>
      </div> */}

      <div className="mt-4 border-t pt-2">
        <button
          type="button"
          onClick={() => setMenuOpen(prev => !prev)}
          className="bg-amber-500 px-3 py-1 text-white"
        >
          Add Field ▼
        </button>

        {menuOpen && (
          <div className="absolute mt-2 bg-white border rounded shadow z-10">
            {["text", "number", "date"].map(t => (
              <button
                key={t}
                onClick={() => handleAddField(t as FieldType)}
                className="block w-full text-left px-4 py-2 hover:bg-amber-100"
              >
                {t === "text" && "Small text"}
                {t === "number" && "Number"}
                {t === "date" && "Date"}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemChanger;
