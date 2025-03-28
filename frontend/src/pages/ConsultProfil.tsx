// import { useState } from 'react';
// import { Card, CardContent, CardTitle } from "../components/ui/card"
// import { useEffect } from 'react';


// interface User{
//   id: number;
//   email: string;
//   firstname: string;
//   lastname: string;
//   description: string;
//   gender: number;
//   preference: number;
//   birthDate: number;
// }


const ConsultProfile = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [images, setImages] = useState<File[]>([]);
//   const [preview, setPreview] = useState<string[]>([]);
//   const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
//   useEffect(() => {
//     const fetchUserProfile = async () => {

//     const token = localStorage.getItem('token');

//     try {
//       const response = await fetch('http://localhost:5001/api/user', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Erreur lors de la récupération du profil');
//       }
      
//       setUser(data.user);
//     } catch (err) {
//       console.error('Erreur:', err);

//     }
//   };
 
//   fetchUserProfile();
//   }, []);

//     if (!user) {
//       return <div>Aucune information utilisateur trouvée.</div>;
//     }

    return (
        <div>rien</div>
//       <Card>
        // <CardTitle><h1>Votre Profil</h1></CardTitle>
        // <img></img>


//           <span className="">Profil de {user.firstname} {user.lastname}</span>
//          <CardContent className='flex flex-col space-y-4'>
//           <h2>Description de {user.firstname}: </h2>
//           <label>Description :</label>
//           <input value={user.description || ''} onChange={(e) => setUser({ ...user, description: e.target.value })}/>
//           <label>FirstName :</label>
//           <input value={user.firstname || ''} onChange={(e) => setUser({ ...user, firstname: e.target.value })}/>
//           <label>LastName :</label>
//           <input value={user.lastname || ''}  onChange={(e) => setUser({ ...user, lastname: e.target.value })} />
//           {/* <p className='value'>{user.description}</p> */}
          

//           <div className="p-4">
//             <input type="file" multiple accept="image/*" onChange={handleFileChange} />
//             <div className="flex space-x-2 mt-2">
//               {preview.map((src, index) => (
//                 <img key={index} src={src} alt="preview" className="w-20 h-20 rounded-lg" />
//               ))}
//             </div>
//             <button 
//               onClick={handleUpload} 
//               className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Uploader
//             </button>
//             {uploadStatus && <p className="mt-2 text-green-600">{uploadStatus}</p>}
//           </div>



//           <button className='text-white' onClick={handleUpdate}>Mettre à jour</button>
//         </CardContent>
//       </Card>
    );
  };
  
export default ConsultProfile;