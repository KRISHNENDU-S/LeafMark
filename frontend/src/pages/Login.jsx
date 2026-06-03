import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleLogin() {
    const data = await login(email, password)
    if (data.error) {
      setError(data.error)
    } else {
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-green-50 p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-6">LeafMark</h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <input
          type="email"
          data-testid="login-email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-green-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          data-testid="login-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-green-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          data-testid="login-submit"
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Login
        </button>

        <p className="text-center text-sm text-green-700 mt-4">
          Don't have an account? <a href="/signup" className="underline font-medium">Sign up</a>
        </p>
      </div>
    </div>
  )
}

export default Login