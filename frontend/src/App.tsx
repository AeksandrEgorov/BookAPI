import { Routes, Route } from 'react-router-dom'
import BooksPage from './pages/BooksPage'
import BooksDetailPage from './pages/BooksDetailPage'

function App() {
  return (
    <Routes>
      <Route path= "/books" />
      <Route path= "/books/:id" />
    </Routes>
  );
}

 
export default App;