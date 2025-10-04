import React, { useState, useCallback } from 'react';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import { fetchWeatherByCity, fetchWeatherByCoords, fetchForecastByCity } from './services/weatherService';
import { fetchLocalityFromCoords, fetchCoordsFromCity } from './services/geocodingService';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locality, setLocality] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const fetchWeather = useCallback(async (cityName) => {
    setLoading(true);
    try {
      let w = await fetchWeatherByCity(cityName);
      if (w.cod !== 200) {
        const coords = await fetchCoordsFromCity(cityName);
        if (coords) {
          w = await fetchWeatherByCoords(coords.lat, coords.lng);
          setCoordinates(coords);
        }
      } else {
        setCoordinates({ lat: w.coord.lat, lng: w.coord.lon });
      }
      const f = await fetchForecastByCity(w.name);
      setWeather(w);
      setForecast(f);
      setLocality(cityName);
    } catch (err) {
      alert('Location not found. Try another name.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log('📍 Your coordinates:', latitude, longitude);

          setCoordinates({ lat: latitude, lng: longitude });
          setLoading(true);
          const w = await fetchWeatherByCoords(latitude, longitude);
          const f = await fetchForecastByCity(w.name);
          const loc = await fetchLocalityFromCoords(latitude, longitude);
          setWeather(w);
          setForecast(f);
          setLocality(loc);
          setLoading(false);
        },
        (err) => {
          alert('Failed to get location. Please allow location access.');
          console.error('Geolocation error:', err);
        }
      );
    } else {
      alert('Geolocation not supported.');
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Voice recognition not supported.');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      setCity(spoken);
      fetchWeather(spoken);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-white mb-4">🌦 Weather App</h1>
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 rounded-md"
          placeholder="Enter city"
        />
        <button onClick={() => fetchWeather(city)} className="bg-blue-600 text-white px-4 py-2 rounded-md">Search</button>
        <button onClick={startVoiceRecognition} className="bg-yellow-500 text-white px-4 py-2 rounded-md">🎤 Speak</button>
        <button onClick={getLocationWeather} className="bg-green-600 text-white px-4 py-2 rounded-md">📍 Use Location</button>
      </div>
      {loading && <p className="text-white">Loading...</p>}
      {coordinates && <p className="text-white text-sm">Lat: {coordinates.lat}, Lon: {coordinates.lng}</p>}
      <WeatherCard weather={weather} locality={locality} />
      <ForecastCard forecast={forecast} />
    </div>
  );
};

export default App;
