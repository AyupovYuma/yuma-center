import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          YUMA CENTER
        </Link>
        <nav>
          <Link to="/" className="mr-4">Home</Link>
          <button onClick={() => window.history.back()} className="mr-4">
            ← Back
          </button>
        </nav>
      </div>
    </header>
  );
}