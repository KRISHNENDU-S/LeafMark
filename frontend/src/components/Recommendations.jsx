import { useState } from 'react';
import { getRecommendations, getGenreRecommendations } from '../api/recommendations';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  async function handleRecommend() {
    setLoading(true);
    setRecommendations([]);
    setExpanded(null);
    const data = await getRecommendations();
    setRecommendations(data);
    setLoading(false);
  }

  async function handleGenre() {
    setLoading(true);
    setRecommendations([]);
    setExpanded(null);
    const data = await getGenreRecommendations();
    setRecommendations(data);
    setLoading(false);
  }

  return (
    <div className="mt-8 p-4 border rounded-lg bg-white">
      <h2 className="text-xl font-bold text-green-800 mb-4">AI Recommendations</h2>
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleRecommend}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Get Recommendations
        </button>
        <button
          onClick={handleGenre}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Genre Suggestions
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {recommendations.length > 0 && !loading && (
        <div className="flex flex-col gap-2">
          {recommendations.map((book, i) => (
            <div
              key={i}
              className="border border-green-200 rounded-lg p-3 cursor-pointer hover:bg-green-50"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-green-900">{book.title}</span>
                  <span className="text-gray-500 text-sm ml-2">by {book.author}</span>
                  {book.genre.split(',').map((g, idx) => (
  <span key={idx} className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{g.trim()}</span>
))}
                </div>
                <span className="text-green-700 text-sm">{expanded === i ? '▲' : '▼'}</span>
              </div>
              {expanded === i && (
                <p className="mt-2 text-sm text-gray-600">{book.reason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}