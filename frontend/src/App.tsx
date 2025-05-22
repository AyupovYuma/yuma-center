import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AuthRoute from "./components/AuthRoute";

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col h-screen font-retro bg-black text-green-400">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {!isAuthPage && <Sidebar />}
        <main className="flex-1 overflow-y-auto p-6 bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
