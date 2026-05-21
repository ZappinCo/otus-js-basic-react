import { Navigate } from 'react-router';
import { useStorage } from '../hooks/useStorage';
import { useEffect } from 'react';

const TodayRedirect = () => {
  const { city: savedCity, saveCity } = useStorage();

  useEffect(() => {
    if (!savedCity) {
      saveCity("Moscow");
    }
  }, [savedCity,saveCity]);

  if (!savedCity) {
    return <div>Loading...</div>;
  }

  return <Navigate to={`/${savedCity}`} replace />;
};

export default TodayRedirect;