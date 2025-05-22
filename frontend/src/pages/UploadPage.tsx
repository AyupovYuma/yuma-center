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
  const developerLogin = localStorage.getItem("developerLogin"); // Получаем логин из localStorage

  const formData = new FormData();
  formData.append("developer_login", developerLogin || ""); // Добавляем обязательное поле
  formData.append("version", version);
  formData.append("description", description);
  formData.append("file", file);

  try {
    const response = await axios.post(
      "http://localhost:8000/builds/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );
    setMessage(`Файл ${response.data.filename} успешно загружен!`);
  } catch (err) {
    setMessage(`Ошибка: ${err.response?.data?.detail || "Неизвестная ошибка"}`);
    console.error("Full error:", err.response?.data);
  }
};
  return (
    <div className="text-green-400">
      <h2 className="text-2xl mb-4 text-green-300">Загрузка билда</h2>
      <div className="space-y-4 max-w-lg">

        <div>
          <label className="block mb-1 text-green-300">Проект*:</label>
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
        </div>

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
