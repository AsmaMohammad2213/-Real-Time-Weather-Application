const API_KEY = '';

export const fetchWeatherByCity = async (city) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  return res.json();
};

export const fetchForecastByCity = async (city) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  return res.json();
};

export const fetchWeatherByCoords = async (lat, lon) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  return res.json();
};
