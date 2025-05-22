import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const [login, setLogin] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/builds/")
      .then(res => setProjects(res.data))
      .catch(err => console.error("Error loading projects:", err));
  }, []);

  const handleRegister = async () => {
    try {
      let projectName = newProjectName;

      if (selectedProjectId) {
        const project = projects.find(p => p.id === selectedProjectId);
        projectName = project?.name || newProjectName;
      }

      await axios.post(
        "http://localhost:8000/auth/register",
        {
          login,
          name,
          password,
          project_name: projectName
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setMessage("Регистрация успешна! Перенаправляем...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setMessage("Ошибка: " + (err.response?.data?.detail || "Неизвестная ошибка"));
    }
  };

  return (
    <div className="text-green-400">
      <h2 className="text-2xl mb-4 text-green-300">Регистрация</h2>
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
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-2 border border-green-500 bg-black"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mb-4">
          <label className="block mb-2 text-green-300">Выберите проект:</label>
          <select
            className="w-full p-2 border border-green-500 bg-black mb-2"
            value={selectedProjectId || ""}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          >
            <option value="">-- Выберите существующий проект --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <p className="text-center text-green-300 my-2">ИЛИ</p>
          <input
            className="w-full p-2 border border-green-500 bg-black"
            type="text"
            placeholder="Создать новый проект"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </div>

        <button
          onClick={handleRegister}
          className="px-4 py-2 border border-green-500 hover:bg-green-600 hover:text-black"
          disabled={!login || !name || !password || (!selectedProjectId && !newProjectName)}
        >
          Зарегистрироваться
        </button>
        {message && <p className="text-sm text-green-300">{message}</p>}
        <p className="text-sm">
          Уже есть аккаунт? <Link to="/login" className="text-green-300 hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}