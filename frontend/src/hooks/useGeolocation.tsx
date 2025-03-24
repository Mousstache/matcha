import { useState, useEffect } from "react";

interface Geolocation {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

const useGeolocation = (): Geolocation => {
  const [location, setLocation] = useState<Geolocation>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: "La géolocalisation n'est pas supportée" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        setLocation((prev) => ({ ...prev, error: error.message }));
      }
    );
  }, []);

  return location;
};

export default useGeolocation;