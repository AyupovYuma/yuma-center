// src/pages/ProjectsPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/builds/").then((res) => setProjects(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4 text-green-300">Проекты</h2>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li
            key={project.id}
            className="border border-green-500 p-4 cursor-pointer hover:bg-green-900"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}