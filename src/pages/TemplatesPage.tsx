import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { addTemplate, deleteTemplate } from "../redux/templatesSlice";
import ItemChanger from "../components/ItemChanger";

const TemplatesPage: React.FC = () => {
  const templates = useSelector((state: RootState) => state.templates ?? {});
  const dispatch = useDispatch();
  const [newType, setNewType] = useState("");

  const handleAddTemplate = () => {
    const trimmed = newType.trim();
    if (trimmed && !templates[trimmed]) {
      dispatch(addTemplate(trimmed));
      setNewType("");
    }
  };

  const handleDeleteTemplate = (type: string) => {
    if (confirm(`Удалить шаблон "${type}"?`)) {
      dispatch(deleteTemplate(type));
    }
  };

  const templateKeys = Object.keys(templates);

  return (
    <div className="p-4 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Templates</h2>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="New template type"
          className="border px-2 py-1"
        />
        <button
          onClick={handleAddTemplate}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Add Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templateKeys.map((type) => (
          <div key={type} className="relative">
            <ItemChanger type={type} />
            <button
              onClick={() => handleDeleteTemplate(type)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
