import { Routes, Route } from 'react-router-dom'
import BooksPage from './pages/BooksPage'

function App() {
  return (
    <Routes>
      <Route path= "/books" element={<BooksPage />} />
      <Route path= "/books/:id" />
    </Routes>
  );
}

 
export default App;