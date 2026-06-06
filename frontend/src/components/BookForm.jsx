import { useState } from 'react'

function BookForm({ onBookAdded }) {
  const [bookname, setBookname] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState('')
  const [rating, setRating] = useState(null)
  const [genres, setGenres] = useState([''])
  const [step, setStep] = useState(0)

  function addGenreField() {
    setGenres([...genres, ''])
  }

  function updateGenre(index, value) {
    const updated = [...genres]
    updated[index] = value
    setGenres(updated)
  }

  function removeGenre(index) {
    const updated = genres.filter((_, i) => i !== index)
    setGenres(updated.length ? updated : [''])
  }

  function handleBooknameOrAuthorChange(field, value) {
    if (field === 'bookname') setBookname(value)
    if (field === 'author') setAuthor(value)
    const bn = field === 'bookname' ? value : bookname
    const au = field === 'author' ? value : author
    if (bn.trim() && au.trim()) setStep(2)
    else setStep(1)
  }

  function handleStatusChange(s) {
    setStatus(s)
    setStep(3)
  }

  async function handleSubmit() {
    const payload = {
      bookname,
      author,
      status,
      rating,
      genres: genres.filter(g => g.trim() !== '')
    }
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (data.book) {
      onBookAdded(data.book)
      setBookname('')
      setAuthor('')
      setStatus('')
      setRating(null)
      setGenres([''])
      setStep(0)
    }
  }

  const disabled = 'opacity-40 cursor-not-allowed'

  return (
    <div>
      {step === 0 && (
        <button
          data-testid="add-book-btn"
          onClick={() => setStep(1)}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-4"
        >
          + Add Book
        </button>
      )}

      <input
        data-testid="book-name"
        type="text"
        placeholder="Book name *"
        value={bookname}
        disabled={step < 1}
        onChange={(e) => handleBooknameOrAuthorChange('bookname', e.target.value)}
        className={`w-full border border-green-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-400 ${step < 1 ? disabled : ''}`}
      />

      <input
        data-testid="book-author"
        type="text"
        placeholder="Author *"
        value={author}
        disabled={step < 1}
        onChange={(e) => handleBooknameOrAuthorChange('author', e.target.value)}
        className={`w-full border border-green-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-400 ${step < 1 ? disabled : ''}`}
      />

      <div className={`mb-3 ${step < 2 ? disabled : ''}`}>
        <p className="text-green-800 font-medium mb-1">Status</p>
        {['read', 'to read', 'reading'].map(s => (
          <label key={s} className="flex items-center gap-2 mb-1 text-green-700 capitalize">
            <input
              data-testid={`status-${s.replace(' ', '-')}`}
              type="radio"
              name="status"
              value={s}
              checked={status === s}
              disabled={step < 2}
              onChange={() => handleStatusChange(s)}
            />
            {s}
          </label>
        ))}
      </div>

      <div className={`mb-3 ${step < 3 ? disabled : ''}`}>
        <p className="text-green-800 font-medium mb-1">Genres</p>
        {genres.map((g, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <button disabled={step < 3} onClick={addGenreField} className="text-green-600 font-bold text-xl">+</button>
            <input
              data-testid={`genre-input-${i}`}
              type="text"
              value={g}
              disabled={step < 3}
              onChange={(e) => updateGenre(i, e.target.value)}
              className="w-full border border-green-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {genres.length > 1 && (
              <button disabled={step < 3} onClick={() => removeGenre(i)} className="text-red-400 font-bold text-xl">−</button>
            )}
          </div>
        ))}
      </div>

      <div className={`mb-4 ${step < 3 ? disabled : ''}`}>
        <p className="text-green-800 font-medium mb-1">Rating</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              data-testid={`rating-${n}`}
              key={n}
              disabled={step < 3}
              onClick={() => setRating(rating === n ? null : n)}
              className={`w-9 h-9 rounded border font-semibold ${rating === n ? 'bg-green-600 text-white border-green-600' : 'border-green-300 text-green-700'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <>
          <button
            data-testid="submit-book"
            disabled={step < 3}
            onClick={handleSubmit}
            className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 ${step < 3 ? disabled : ''}`}
          >
            Add Book
          </button>
          <button
            onClick={() => {
              setBookname('')
              setAuthor('')
              setStatus('')
              setRating(null)
              setGenres([''])
              setStep(0)
            }}
            className="w-full mt-2 border-2 border-green-700 text-green-800 font-medium py-2 rounded-lg hover:bg-green-100"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  )
}

export default BookForm