import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage"; // Исправленный импорт
import BuildsPage from "./pages/BuildsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/project/:projectId" element={<BuildsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;