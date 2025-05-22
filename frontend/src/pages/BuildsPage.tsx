import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Developer {
  id: number;
  login: string;
  name: string;
  project_id: number;
}

interface Comment {
  id: number;
  text: string;
  created_at: string;
  developer_id: number;
  developer?: Developer;
}

interface Build {
  id: number;
  version: string;
  description: string;
  filename: string;
  upload_time: string;
  file_path: string;
  developer_id: number;
  developer: Developer;
  comments: Comment[];
}

export default function BuildsPage() {
  const { id: projectId } = useParams();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBuilds, setExpandedBuilds] = useState<Record<number, boolean>>({});
  const [newComment, setNewComment] = useState(""); // Добавлено состояние для нового комментария

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/builds/project/${projectId}?sort=newest`
        );
        setBuilds(response.data);
        const initialExpanded: Record<number, boolean> = {};
        response.data.forEach((build: Build) => {
          initialExpanded[build.id] = false;
        });
        setExpandedBuilds(initialExpanded);
      } catch (err) {
        console.error("Ошибка загрузки сборок:", err);
        setError("Не удалось загрузить сборки");
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, [projectId]);

  const handleDownload = (build: Build) => {
    const downloadUrl = `http://localhost:8000/builds/download/${build.developer_id}/${encodeURIComponent(build.filename)}`;
    window.open(downloadUrl, '_blank');
  };

  const handleAddComment = async (buildId: number, text: string) => {
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      const developerId = localStorage.getItem("developerId");

//       if (!token || !developerId) {
//         throw new Error("Требуется авторизация");
//       }

      await axios.post(
        `http://localhost:8000/builds/${buildId}/comments`,
        {
          text: text,
          developer_id: Number(developerId)
        },
      );
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }


      // Обновляем список сборок после добавления комментария
      const response = await axios.get(
        `http://localhost:8000/builds/project/${projectId}?sort=newest`
      );
      setBuilds(response.data);
      setNewComment("");
    } catch (err) {
      console.error("Ошибка добавления комментария:", err);
      setError(`Не удалось добавить комментарий: ${err.response?.data?.detail || err.message}`);
    }
  };

  const toggleComments = (buildId: number) => {
    setExpandedBuilds(prev => ({
      ...prev,
      [buildId]: !prev[buildId]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="text-green-400 p-4">Загрузка...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="text-green-400 p-4">
      <h2 className="text-2xl mb-4 text-green-300">Сборки проекта #{projectId}</h2>

      {builds.length === 0 ? (
        <p className="text-green-300">Нет доступных сборок</p>
      ) : (
        <div className="space-y-4">
          {builds.map((build) => (
            <div key={build.id} className="border border-green-500 p-3 rounded-lg bg-black bg-opacity-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-green-300 truncate">
                    {build.filename}
                  </h3>
                  <p className="text-sm mb-1">
                    <span className="text-green-400">v{build.version}</span> •
                    <span className="text-green-500 ml-2">{build.developer.name}</span>
                  </p>
                  {build.description && (
                    <p className="text-sm text-green-400 mb-2">{build.description}</p>
                  )}
                  <p className="text-xs text-green-500">
                    {formatDate(build.upload_time)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleDownload(build)}
                    className="px-3 py-1 border border-green-500 hover:bg-green-600 hover:text-black text-sm whitespace-nowrap"
                  >
                    Скачать
                  </button>
                  <button
                    onClick={() => toggleComments(build.id)}
                    className="text-xs text-green-300 hover:underline"
                  >
                    {expandedBuilds[build.id] ? "Скрыть" : "Показать"} комментарии ({build.comments.length})
                  </button>
                </div>
              </div>

              {expandedBuilds[build.id] && (
                <div className="mt-3 pt-3 border-t border-green-700">
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {build.comments.length > 0 ? (
                      [...build.comments]
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .map((comment) => (
                          <div key={comment.id} className="text-sm">
                            <p className="text-green-400">{comment.text}</p>
                            <p className="text-xs text-green-500">
                              {comment.developer?.name || 'Аноним'}, {formatDate(comment.created_at)}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-green-500">Нет комментариев</p>
                    )}
                  </div>

                  <div className="mt-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-2 border border-green-500 bg-black text-green-400 text-sm"
                      placeholder="Написать комментарий..."
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (newComment.trim()) {
                            handleAddComment(build.id, newComment.trim());
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-green-500 mt-1">Нажмите Enter для отправки</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}