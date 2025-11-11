import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./redux/store";
import { syncWithTemplates } from "./redux/itemsSlice";
import List from "./components/List";
import TemplatesPage from "./pages/TemplatesPage";
import AllPage from "./pages/AllPage";
import Header from "./components/Header";

const TemplatesSyncer: React.FC = () => {
  const templates = useSelector((s: RootState) => s.templates ?? {});
  const dispatch = useDispatch<AppDispatch>();
  const templatesJson = JSON.stringify(templates);

  useEffect(() => {
    dispatch(syncWithTemplates(templates));
  }, [dispatch, templatesJson]);

  return null;
};

const App: React.FC = () => {
  return (
    <>
      <TemplatesSyncer />
      <Header />

      <main className="p-4">
        <Routes>
          <Route path="/all" element={<List />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/items/:id" element={<AllPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
