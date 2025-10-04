import React from 'react';

const WeatherCard = ({ weather, locality, coords }) => {
  if (!weather || weather.cod !== 200) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md max-w-md text-center">
      <h2 className="text-2xl font-bold mb-2">{locality || weather.name}</h2>
      {coords && <p className="text-sm text-gray-600">Lat: {coords.lat}, Lon: {coords.lon}</p>}
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Icon" className="mx-auto" />
      <p className="text-xl">{weather.weather[0].main}</p>
      <p className="text-4xl font-bold">{weather.main.temp}°C</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

export default WeatherCard;