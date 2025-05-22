import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('username', login);
      formData.append('password', password);

      const res = await axios.post(
        "http://localhost:8000/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      localStorage.setItem("authToken", res.data.access_token); // Исправлено на access_token
      localStorage.setItem("developerLogin", res.data.login);
      setMessage("Успешный вход! Перенаправляем...");
      setTimeout(() => navigate("/projects"), 1500);
    } catch (err: any) {
      setMessage("Ошибка входа: " + (err?.response?.data?.detail || "Неизвестная ошибка"));
    }
  };

  return (
    <div className="text-green-400">
      <h2 className="text-2xl mb-4 text-green-300">Авторизация</h2>
      <div className="space-y-4 max-w-md">
        <input
          className="w-full p-2 border border-green-500 bg-black"
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          className="w-full p-2 border border-green-500 bg-black"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="px-4 py-2 border border-green-500 hover:bg-green-600 hover:text-black"
        >
          Войти
        </button>
        {message && <p className="text-sm text-green-300">{message}</p>}
        <p className="text-sm">
          Нет аккаунта? <Link to="/register" className="text-green-300 hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}