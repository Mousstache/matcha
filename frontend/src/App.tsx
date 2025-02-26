import { useState, useEffect } from 'react';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string; // Optionnel si vous avez ce champ
}


function App() {
  const [users, setUsers] = useState<User[]>([]);
  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Liste des utilisateurs</h1>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}

export default App;
