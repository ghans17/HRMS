import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function Home() {
  return (
    <div>
      <h1>Welcome to HRMS</h1>
      <p>This is the home page.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
