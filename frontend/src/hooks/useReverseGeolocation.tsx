import { useEffect, useState } from "react";

interface LocationInfo {
  city: string | null;
  country: string | null;
  error: string | null;
}

const useReverseGeolocation = (latitude: number | null, longitude: number | null): LocationInfo => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    city: null,
    country: null,
    error: null,
  });

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchLocation = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        if (data.address) {
          setLocationInfo({
            city: data.address.city || data.address.town || data.address.village || "Inconnu",
            country: data.address.country || "Inconnu",
            error: null,
          });
        } else {
          setLocationInfo((prev) => ({ ...prev, error: "Impossible de récupérer l'emplacement" }));
        }
      } catch (error) {
        setLocationInfo((prev) => ({ ...prev, error: "Erreur lors de la récupération des données" }));
      }
    };

    fetchLocation();
  }, [latitude, longitude]);

  return locationInfo;
};

export default useReverseGeolocation;