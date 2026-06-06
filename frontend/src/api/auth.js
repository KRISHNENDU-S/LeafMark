const API_URL = import.meta.env.VITE_API_URL + '/api'

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
  return response.json()
}

export async function signup(username, email, password) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, email, password })
  })
  return response.json()
}

export async function getMe() {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: 'include'
  })
  return response.json()
}

export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  })
  return response.json()
}