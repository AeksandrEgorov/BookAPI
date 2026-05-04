import { Routes, Route, Navigate } from 'react-router-dom'
import BooksPage from './pages/BooksPage'
import BookDetailPage from './pages/BookDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/books" />} />
      <Route path= "/books" element={<BooksPage />} />
      <Route path= "/books/:id" element={<BookDetailPage />} />
    </Routes>
  );
}


export default App;