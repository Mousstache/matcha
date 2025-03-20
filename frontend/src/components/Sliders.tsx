// import React, { useState, useEffect } from 'react';
// import { Slider } from '@/components/ui/slider';

// const FilterComponent = () => {
//   // Initialiser avec des valeurs par défaut raisonnables
//   const [minAge, setMinAge] = useState<number>(18);
//   const [maxAge, setMaxAge] = useState<number>(40);
//   const [distance, setDistance] = useState<number>(25);
  
//   // États pour les sliders
//   const [ageRange, setAgeRange] = useState<number[]>([18, 40]);
//   const [distanceValue, setDistanceValue] = useState<number[]>([25]);
  
//   // Synchroniser les états initiaux
//   useEffect(() => {
//     setAgeRange([minAge, maxAge]);
//     setDistanceValue([distance]);
//   }, []);
  
//   // Gestionnaires d'événements
//   const handleAgeChange = (values: number[]) => {
//     setAgeRange(values);
//     setMinAge(values[0]);
//     setMaxAge(values[1]);
//   };
  
//   const handleDistanceChange = (values: number[]) => {
//     setDistanceValue(values);
//     setDistance(values[0]);
//   };
  
//   return (
//     <div className="w-full max-w-md p-4 space-y-8">
//       <div className="space-y-6">
//         <h3 className="text-lg font-medium">Tranche d'âge: {minAge} - {maxAge} ans</h3>
//         <Slider 
//           onValueChange={handleAgeChange}
//           value={ageRange}
//           max={100} 
//           min={18} 
//           step={1}
//         />
//       </div>
      
//       <div className="space-y-6">
//         <h3 className="text-lg font-medium">Distance maximale: {distance} km</h3>
//         <Slider 
//           onValueChange={handleDistanceChange}
//           value={distanceValue}
//           max={100} 
//           min={1} 
//           step={1}
//         />
//       </div>
//     </div>
//   );
// };

// export default FilterComponent;