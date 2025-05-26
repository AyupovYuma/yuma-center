import { useState, useEffect } from "react";
import axios from "axios";

interface Project {
  id: number;
  name: string;
}

export default function UploadPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get("http://localhost:8000/builds/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjects(res.data);
        if (res.data.length > 0) {
          setSelectedProjectId(res.data[0].id);
        }
      });
  }, []);

  const handleUpload = async () => {
    if (!file || !selectedProjectId || !version) {
      setMessage("Заполните все обязательные поля");
      return;
    }

    const token = localStorage.getItem("authToken");
    const developerLogin = localStorage.getItem("developerLogin");

    const formData = new FormData();
    formData.append("developer_login", developerLogin || "");
    formData.append("version", version);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("project_id", selectedProjectId.toString());

    try {
      const response = await axios.post(
        "http://localhost:8000/builds/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(`Файл ${response.data.filename} успешно загружен!`);
    } catch (err: any) {
      setMessage(`Ошибка: ${err.response?.data?.detail || "Неизвестная ошибка"}`);
      console.error("Full error:", err.response?.data);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setMessage("Введите имя проекта");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const res = await axios.post(
        "http://localhost:8000/projects/",
        { name: newProjectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProjects((prev) => [...prev, res.data]);
      setSelectedProjectId(res.data.id);
      setNewProjectName("");
      setShowNewProjectInput(false);
      setMessage(`Проект "${res.data.name}" успешно создан!`);
    } catch (err: any) {
      setMessage(`Ошибка: ${err.response?.data?.detail || "Ошибка создания проекта"}`);
    }
  };

  return (
    <div className="text-green-400">
      <h2 className="text-2xl mb-4 text-green-300">Загрузка билда</h2>
      <div className="space-y-4 max-w-lg">

        {/* Проект + кнопка */}
        <div>
          <label className="block mb-1 text-green-300">Проект*:</label>
          <div className="flex items-center space-x-2">
            <select
              className="w-full p-2 border border-green-500 bg-black"
              value={selectedProjectId || ""}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              required
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <button
              className="h-10 px-3 border border-green-500 hover:bg-green-600 hover:text-black"
              onClick={() => setShowNewProjectInput((prev) => !prev)}
            >
              New Project
            </button>
          </div>
        </div>

        {/* Ввод нового проекта */}
        {showNewProjectInput && (
          <div className="flex items-center space-x-2">
            <input
              className="flex-1 p-2 border border-green-500 bg-black"
              type="text"
              placeholder="Название нового проекта"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <button
              className="h-10 px-3 border border-green-500 hover:bg-green-600 hover:text-black"
              onClick={handleCreateProject}
            >
              Создать
            </button>
          </div>
        )}

        {/* Остальные поля */}
        <input
          className="w-full p-2 border border-green-500 bg-black"
          type="text"
          placeholder="Версия*"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 border border-green-500 bg-black"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full p-2 border border-green-500 bg-black"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />

        <button
          onClick={handleUpload}
          className="px-4 py-2 border border-green-500 hover:bg-green-600 hover:text-black"
          disabled={!file || !selectedProjectId || !version}
        >
          Загрузить
        </button>

        {message && (
          <p
            className={`mt-2 text-sm ${
              message.includes("успешно") ? "text-green-300" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
