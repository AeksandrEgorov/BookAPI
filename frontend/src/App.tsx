import { Routes, Route, Navigate } from 'react-router-dom'
import BooksPage from './pages/BooksPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/books" />} />
      <Route path= "/books" element={<BooksPage />} />
      <Route path= "/books/:id" />
    </Routes>
  );
}


export default App;