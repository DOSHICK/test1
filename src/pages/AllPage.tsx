import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import Item from "../components/Item";
import { updateItemValues, deleteItem } from "../redux/itemsSlice";

const AllPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const item = useSelector((s: RootState) => s.items.items?.[id ?? ""]);
  const dispatch = useDispatch<AppDispatch>();

  if (!item) return <div>Item not found</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Item {item.id}</h2>
      <Item
        key={item.id}
        type={item.type}
        values={item.values}
        onUpdate={(updated) => dispatch(updateItemValues({ id: item.id, values: updated }))}
        onDelete={() => dispatch(deleteItem(item.id))}
      />
    </div>
  );
};

export default AllPage;