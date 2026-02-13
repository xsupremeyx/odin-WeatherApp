import './styles.css';
const key = '8BQC4QP8BXU2YEPGA2PEP4SUD';

function processWeatherData(data) {
  return {
    location: data.resolvedAddress,
    temperature: data.currentConditions.temp,
    condition: data.currentConditions.conditions,
    icon: data.currentConditions.icon,
  };
}

async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&contentType=json&key=${key}`
    );
    if (!response.ok) {
      throw new Error('Location not found');
    }
    const data = await response.json();
    console.log(processWeatherData(data));
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
}

const handleSearch = () => {
  const form = document.getElementById('search-form');
  const input = document.getElementById('city-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;
    getWeather(city);
  });
};

handleSearch();
