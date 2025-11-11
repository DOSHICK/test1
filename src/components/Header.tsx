import React from "react";
import { NavLink } from "react-router-dom";
import { fetchAvailableTypes } from "../redux/typesService";

const Header: React.FC = () => {
  const [types, setTypes] = React.useState<string[]>([]);

  React.useEffect(() => {
    fetchAvailableTypes().then(setTypes);
  }, []);

  return (
    <header className="bg-amber-200 p-4 flex gap-4 border-b border-amber-700">
      {types.map((type) => (
        <NavLink
          key={type}
          to={`/${type}`}
          className={({ isActive }) =>
            isActive ? "font-bold underline" : ""
          }
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </NavLink>
      ))}

      <NavLink
        key={"templates"}
        to={`/templates`}
        className={({ isActive }) =>
          isActive ? "font-bold underline" : ""
        }
      >
        Templates
      </NavLink>
    </header>
  );
};

export default Header;
