const API_URL = 'http://localhost:3000/api'

export async function getBooks(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.genre) params.append('genre', filters.genre)
  if (filters.rating) params.append('rating', filters.rating)

  const response = await fetch(`${API_URL}/books?${params.toString()}`, {
    credentials: 'include'
  })
  return response.json()
}

export async function addBook(payload) {
  const response = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  return response.json()
}

export async function updateBook(id, payload) {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  return response.json()
}

export async function deleteBook(id) {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return response.json()
}
