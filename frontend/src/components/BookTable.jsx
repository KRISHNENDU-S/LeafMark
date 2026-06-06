import { useState } from 'react'

function BookTable({ books, onDelete, onUpdate }) {
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})

  function startEdit(book) {
    setEditId(book.bookid)
    setEditData({
      bookname: book.bookname,
      author: book.author,
      status: book.status,
      rating: book.rating,
      genres: book.genres?.join(', ') || ''
    })
  }

  function cancelEdit() {
    setEditId(null)
    setEditData({})
  }

  function saveEdit(bookid) {
    const payload = {
      bookname: editData.bookname,
      author: editData.author,
      status: editData.status,
      rating: editData.rating === '' || editData.rating === null ? null : Number(editData.rating),
      genres: editData.genres ? editData.genres.split(',').map(g => g.trim()).filter(Boolean) : []
    }
    onUpdate(bookid, payload)
    setEditId(null)
    setEditData({})
  }

  if (books.length === 0) {
    return (
      <div data-testid="no-books" className="flex items-center justify-center h-48 border border-green-200 rounded-lg">
        <p className="text-green-600 text-lg">No books found</p>
      </div>
    )
  }

  return (
    <table data-testid="book-table" className="w-full border-collapse">
      <thead>
        <tr className="bg-green-100 text-green-800">
          <th className="text-left px-4 py-2 border border-green-200">No</th>
          <th className="text-left px-4 py-2 border border-green-200">Name</th>
          <th className="text-left px-4 py-2 border border-green-200">Author</th>
          <th className="text-left px-4 py-2 border border-green-200">Status</th>
          <th className="text-left px-4 py-2 border border-green-200">Genre</th>
          <th className="text-left px-4 py-2 border border-green-200">Rating</th>
          <th className="text-left px-4 py-2 border border-green-200">Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr key={book.bookid} data-testid={`book-row-${book.bookid}`} className="hover:bg-green-50">
            <td className="px-4 py-2 border border-green-200">{index + 1}</td>

            {editId === book.bookid ? (
              <>
                <td className="px-2 py-1 border border-green-200">
                  <input data-testid="edit-bookname" value={editData.bookname} onChange={e => setEditData({...editData, bookname: e.target.value})}
                    className="w-full border border-green-300 rounded px-2 py-1 text-sm" />
                </td>
                <td className="px-2 py-1 border border-green-200">
                  <input data-testid="edit-author" value={editData.author} onChange={e => setEditData({...editData, author: e.target.value})}
                    className="w-full border border-green-300 rounded px-2 py-1 text-sm" />
                </td>
                <td className="px-2 py-1 border border-green-200">
                  <select data-testid="edit-status" value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})}
                    className="w-full border border-green-300 rounded px-2 py-1 text-sm">
                    <option value="read">Read</option>
                    <option value="to read">To Read</option>
                    <option value="reading">Reading</option>
                  </select>
                </td>
                <td className="px-2 py-1 border border-green-200">
                  <input data-testid="edit-genres" value={editData.genres} onChange={e => setEditData({...editData, genres: e.target.value})}
                    placeholder="comma separated"
                    className="w-full border border-green-300 rounded px-2 py-1 text-sm" />
                </td>
                <td className="px-2 py-1 border border-green-200">
                  <input data-testid="edit-rating" value={editData.rating ?? ''} onChange={e => setEditData({...editData, rating: e.target.value === '' ? null : e.target.value})}
                    type="number" min="1" max="5"
                    className="w-full border border-green-300 rounded px-2 py-1 text-sm" />
                </td>
                <td className="px-2 py-1 border border-green-200">
                  <button data-testid="save-edit" onClick={() => saveEdit(book.bookid)}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded mr-1 hover:bg-green-700">Save</button>
                  <button data-testid="cancel-edit" onClick={cancelEdit}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">Cancel</button>
                </td>
              </>
            ) : (
              <>
                <td data-testid={`bookname-${book.bookid}`} className="px-4 py-2 border border-green-200">{book.bookname}</td>
                <td data-testid={`author-${book.bookid}`} className="px-4 py-2 border border-green-200">{book.author}</td>
                <td data-testid={`status-${book.bookid}`} className="px-4 py-2 border border-green-200 capitalize">{book.status}</td>
                <td data-testid={`genres-${book.bookid}`} className="px-4 py-2 border border-green-200">{book.genres?.join(', ') || '—'}</td>
                <td data-testid={`rating-${book.bookid}`} className="px-4 py-2 border border-green-200">{book.rating || '—'}</td>
                <td className="px-4 py-2 border border-green-200">
                  <button data-testid={`edit-btn-${book.bookid}`} onClick={() => startEdit(book)}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mr-2 hover:bg-green-200">Edit</button>
                  <button data-testid={`delete-btn-${book.bookid}`} onClick={() => onDelete(book.bookid)}
                    className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded hover:bg-red-200">Delete</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
</div>
  )
}

export default BookTable