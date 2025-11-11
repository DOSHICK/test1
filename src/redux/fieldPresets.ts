
export type FieldType = "text" | "number" | "date";
export type FieldConfig = {
    name: string;
    label: string;
    type: FieldType;
};
export const fieldPresets: Record<string, FieldConfig[]> = {
    Chainsaws: [
        { name: "model", label: "Model", type: "text" },
        { name: "type", label: "Type", type: "text" },
        { name: "grade", label: "Grade", type: "text" },
        { name: "barLength", label: "Bar Length (Inch)", type: "number" },
        { name: "brand", label: "Brand", type: "text" },
        { name: "dateBuild", label: "Date build", type: "date" },
        { name: "quantity", label: "Quantity", type: "number" }
    ],
    Bulldozers: [
        { name: "model", label: "Model", type: "text" },
        { name: "powerNet", label: "Power net", type: "text" },
        { name: "operatingWeight", label: "Operating weight", type: "text" },
        { name: "brand", label: "Brand", type: "text" },
        { name: "dateBuild", label: "Date build", type: "date" },
        { name: "quantity", label: "Quantity", type: "number" }
    ]
};
