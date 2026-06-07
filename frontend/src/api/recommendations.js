const API_URL = import.meta.env.VITE_API_URL;

export async function getRecommendations() {
  const res = await fetch(`${API_URL}/api/recommendations`, {
    credentials: 'include',
  });
  const data = await res.json();
  return data.recommendations;
}

export async function getGenreRecommendations() {
  const res = await fetch(`${API_URL}/api/recommendations/genre`, {
    credentials: 'include',
  });
  const data = await res.json();
  return data.recommendations;
}