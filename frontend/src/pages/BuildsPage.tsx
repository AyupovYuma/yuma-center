import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { DownloadIcon } from "lucide-react";

interface Build {
  id: number;
  version: string;
  created_at: string;
  description: string;
  filename: string;
  developer_id: number;
  comments?: Comment[];
}

interface Comment {
  id: number;
  text: string;
  created_at: string;
  author: string;
}

export default function BuildsPage() {
  const { projectId } = useParams();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBuilds, setSortBuilds] = useState<"newest" | "oldest">("newest");
  const [sortComments, setSortComments] = useState<"newest" | "oldest">("newest");
  const [newComment, setNewComment] = useState("");

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Дата неизвестна";

      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch (error) {
      console.error("Ошибка форматирования даты:", error);
      return "Дата неизвестна";
    }
  };

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/builds/project/${projectId}?sort=${sortBuilds}`
        );

        if (!response.ok) throw new Error("Ошибка загрузки сборок");

        const data = await response.json();
        setBuilds(data);
      } catch (err) {
        console.error("Ошибка:", err);
        setError("Не удалось загрузить сборки");
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, [projectId, sortBuilds]);

  const handleCommentSubmit = async (buildId: number) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:8000/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          build_id: buildId,
          text: newComment,
          developer_id: 1 // Заменить на реальный ID
        })
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setBuilds(prev => prev.map(b =>
          b.id === buildId
            ? {...b, comments: [...(b.comments || []), newCommentData]}
            : b
        ));
        setNewComment("");
      }
    } catch (error) {
      console.error("Ошибка отправки комментария:", error);
    }
  };

  const sortedBuilds = [...builds].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortBuilds === "newest" ? dateB - dateA : dateA - dateB;
  });

  const sortedComments = (comments?: Comment[]) => {
    if (!comments) return [];
    return [...comments].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortComments === "newest" ? dateB - dateA : dateA - dateB;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-pixel">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-6 flex-wrap">
          <select
            value={sortBuilds}
            onChange={(e) => setSortBuilds(e.target.value as any)}
            className="bg-gray-800 text-gray-100 p-2 rounded border border-gray-700"
          >
            <option value="newest">Новые сборки сначала</option>
            <option value="oldest">Старые сборки сначала</option>
          </select>

          <select
            value={sortComments}
            onChange={(e) => setSortComments(e.target.value as any)}
            className="bg-gray-800 text-gray-100 p-2 rounded border border-gray-700"
          >
            <option value="newest">Новые комментарии сначала</option>
            <option value="oldest">Старые комментарии сначала</option>
          </select>
        </div>

        <div className="space-y-6">
          {sortedBuilds.map((build) => (
            <Card key={build.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-300">
                      Версия: {build.version}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {formatDate(build.created_at)}
                    </p>
                    <p className="mt-2 text-gray-300">{build.description}</p>
                  </div>
                  <a
                    href={`http://localhost:8000/builds/download/${build.developer_id}/${build.filename}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    download
                  >
                    <DownloadIcon className="w-5 h-5" />
                    Скачать
                  </a>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-bold mb-3 text-gray-400">Комментарии:</h4>
                  <div className="space-y-3">
                    {sortedComments(build.comments).map((comment) => (
                      <div key={comment.id} className="bg-gray-700 p-3 rounded">
                        <p className="text-gray-100">{comment.text}</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-gray-400">
                            {comment.author}
                          </span>
                          <span className="text-sm text-gray-400">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-gray-100 rounded border border-gray-600"
                      placeholder="Написать комментарий..."
                      rows={3}
                    />
                    <button
                      onClick={() => handleCommentSubmit(build.id)}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Отправить комментарий
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}