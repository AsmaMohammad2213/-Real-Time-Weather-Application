import { useEffect } from 'react';

const useVoiceSearch = (setCity, fetchWeather) => {
  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const spokenCity = e.results[0][0].transcript;
      setCity(spokenCity);
      fetchWeather(spokenCity);
    };

    const button = document.getElementById('mic-btn');
    if (button) {
      button.onclick = () => recognition.start();
    }
  }, [setCity, fetchWeather]);
};

export default useVoiceSearch;
