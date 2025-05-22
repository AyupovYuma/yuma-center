import { Link } from "react-router-dom";

export default function Header() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const developerLogin = localStorage.getItem("developerLogin");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("developerLogin");
    window.location.href = "/";
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-green-500 bg-black">
      <Link to="/" className="text-xl uppercase tracking-widest text-green-300">
        YUMA Center
      </Link>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-green-400">{developerLogin}</span>
            <button
              onClick={handleLogout}
              className="border border-green-500 px-4 py-2 text-sm hover:bg-green-700 hover:text-black transition"
            >
              Выйти
            </button>
          </>
        ) : (
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="border border-green-500 px-4 py-2 text-sm hover:bg-green-700 hover:text-black transition"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="border border-green-500 px-4 py-2 text-sm hover:bg-green-700 hover:text-black transition"
            >
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}