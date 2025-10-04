import React from 'react';

const ForecastCard = ({ forecast }) => {
  if (!forecast || forecast.cod !== "200") return null;

  const filtered = forecast.list.filter((_, i) => i % 8 === 0);

  return (
    <div className="mt-6 max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-4">
      {filtered.map((f, i) => (
        <div key={i} className="bg-white p-4 rounded-xl text-center shadow">
          <p>{new Date(f.dt * 1000).toLocaleDateString()}</p>
          <img src={`https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`} alt="" className="mx-auto" />
          <p>{f.weather[0].main}</p>
          <p className="font-bold">{f.main.temp}°C</p>
        </div>
      ))}
    </div>
  );
};

export default ForecastCard;
