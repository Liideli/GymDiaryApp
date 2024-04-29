import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import Exercise from './components/Exercise';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useEffect, useState } from 'react';
import { User } from './types/User';
import { WorkoutContext } from './WorkoutContext';
import { SearchContext } from './SearchContext';
import { Workout } from './types/Workout';


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Workout[]>([]);

  // Load user data from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      <WorkoutContext.Provider value={{ workoutId, setWorkoutId }}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exercise/:id" element={<Exercise />} />
        </Routes>
      </Router>
      </WorkoutContext.Provider>
      </SearchContext.Provider> 
    </UserContext.Provider>
    
  );
}

export default App;