// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

const linkClass =
  "block py-2 px-4 border-l-4 border-transparent hover:border-green-500 hover:bg-green-900 transition";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black border-r border-green-500 p-4">
      <nav className="space-y-1">
        <NavLink to="/" className={linkClass}>🏠 Главная</NavLink>
        <NavLink to="/projects" className={linkClass}>📁 Проекты</NavLink>
        <NavLink to="/upload" className={linkClass}>⬆ Загрузить билд</NavLink>
        <NavLink to="/comments" className={linkClass}>💬 Комментарии</NavLink>
      </nav>
    </aside>
  );
}
