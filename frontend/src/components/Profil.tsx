import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/auth';

interface SearchParams{
  username: string;
}

const Profile = () => {
  const { username } = useParams<SearchParams>();
  const { firstname } = useAuth(); 

    return (
      <div className="w-full bg-blue-500">
        <span className="">Profil de {username}</span>
        <div className="bg-red-500">
          
          <h2>description de {firstname}: </h2>
          <p>ici la description..</p>
        </div>
        </div>
    );
  };
  
  export default Profile;