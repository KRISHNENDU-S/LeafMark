import { useState, useEffect } from 'react'
import { getMe, logout } from '../api/auth'
import BookForm from '../components/BookForm'
import BookTable from '../components/BookTable'
import Recommendations from '../components/Recommendations'
import { getBooks, deleteBook, updateBook } from '../api/books'


function Home() {
  const [username, setUsername] = useState('')
  const [books, setBooks] = useState([])
  const [filters, setFilters] = useState({ status: '', genre: '', rating: '' })
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMe().then(data => {
      if (data.user) setUsername(data.user.username)
    })
  }, [])

  async function handleLogout() {
    await logout()
    window.location.href = '/'
  }

  useEffect(() => {
    getBooks(filters).then(data => {
      if (data.books) setBooks(data.books)
    })
  }, [filters])

  async function handleDelete(bookid) {
    await deleteBook(bookid)
    setBooks(books.filter(b => b.bookid !== bookid))
  }

  async function handleUpdate(bookid, payload) {
    const data = await updateBook(bookid, payload)
    if (data.book) {
      setBooks(books.map(b => b.bookid === bookid ? data.book : b))
    }
  }

  const uniqueGenres = [...new Set(books.flatMap(b => b.genres))]

  const filteredBooks = search
    ? books.filter(b =>
        b.bookname.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      )
    : books

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full bg-green-700 text-white px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-lg">Welcome to LeafMark, {username}!!!</span>
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-green-100"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <div className="w-full md:w-1/3 bg-green-50 p-6 border-r border-green-200">
          <h2 className="text-xl font-bold text-green-800 mb-4">Add Book</h2>
          <BookForm onBookAdded={() => getBooks(filters).then(data => {
            if (data.books) setBooks(data.books)
          })} />
        </div>

        <div className="w-full md:w-2/3 p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-green-800">Book List</h2>
            <input
              data-testid="search-input"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-green-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex gap-3 pb-3 mb-4 border-b border-green-200">
            <select
              data-testid="filter-status"
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
              className="flex-1 border border-green-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">All status</option>
              <option value="read">Read</option>
              <option value="to read">To Read</option>
              <option value="reading">Reading</option>
            </select>

            <select
              data-testid="filter-genre"
              value={filters.genre}
              onChange={e => setFilters({...filters, genre: e.target.value})}
              className="flex-1 border border-green-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">All genres</option>
              {uniqueGenres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              data-testid="filter-rating"
              value={filters.rating}
              onChange={e => setFilters({...filters, rating: e.target.value})}
              className="flex-1 border border-green-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">All ratings</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <BookTable books={filteredBooks} onDelete={handleDelete} onUpdate={handleUpdate} />
        </div>
      </div>

      <div className="px-6 pb-6">
        <Recommendations />
      </div>
    </div>
  )
}

export default Home