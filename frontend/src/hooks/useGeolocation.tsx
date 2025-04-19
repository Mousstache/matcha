import { useState, useEffect } from "react";

interface Geolocation {
  latitude: number | null;
  longitude: number | null;
  fromIP: boolean;
  error: string | null;
}

const useGeolocation = (): Geolocation => {
  const [location, setLocation] = useState<Geolocation>({
    latitude: null,
    longitude: null,
    fromIP: false,
    error: null,
  });

  useEffect(() => {
    const fetchIPLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json");
        const data = await response.json();
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          error: null,
          fromIP: true,
        });
      } catch (err) {
        setLocation((prev) => ({
          ...prev,
          error: "Impossible de récupérer la position via IP",
        }));
      }
    };

    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: "La géolocalisation n'est pas supportée" }));
      fetchIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          fromIP: false,
        });
      },
      (error) => {
        setLocation((prev) => ({ ...prev, error: error.message }));
        fetchIPLocation();
      }
    );
  }, []);

  return location;
};

export default useGeolocation;