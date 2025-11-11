import React from "react";

type Props = {
    type: string;
    values: Record<string, string | number | Date>;
    onUpdate: (updatedValues: Record<string, string | number | Date>) => void;
    onDelete: () => void;
};

const Item: React.FC<Props> = ({ type, values, onUpdate, onDelete }) => {
    const handleChange = (key: string, value: string) => {
        const updated = { ...values, [key]: value };
        onUpdate(updated);
    };

    return (
        <div className="border p-2 mb-2 bg-white shadow">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold mb-1">
                    {type} - <span>{JSON.stringify(values.model)}</span>
                </h4>
                <button
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700 font-bold"
                >
                    X
                </button>
            </div>
            <ul className="text-sm">
                {Object.entries(values).map(([key, value]) => (
                    <li key={key} className="mb-1 flex gap-2 items-center">
                        <label className="w-24 font-medium">{key}:</label>
                        <input
                            type="text"
                            value={String(value)}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="border px-2 py-1 flex-1"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Item;
