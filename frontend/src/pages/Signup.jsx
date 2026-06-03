import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'

function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSignup() {
    const data = await signup(username, email, password)
    if (data.error) {
      setError(data.error)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-green-50 p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-6">LeafMark</h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <input
          type="text"
          data-testid="signup-username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-green-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="email"
          data-testid="signup-email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-green-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          data-testid="signup-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-green-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          data-testid="signup-submit"
          onClick={handleSignup}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-green-700 mt-4">
          Already have an account? <a href="/" className="underline font-medium">Login</a>
        </p>
      </div>
    </div>
  )
}

export default Signup