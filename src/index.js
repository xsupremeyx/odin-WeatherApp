import './styles.css';
const elements = {
  container: document.getElementById('weather-display'),
  form: document.getElementById('search-form'),
  input: document.getElementById('city-input'),
};
const key = '8BQC4QP8BXU2YEPGA2PEP4SUD';

function processWeatherData(data) {
  return {
    location: data.resolvedAddress,
    temperature: data.currentConditions.temp,
    condition: data.currentConditions.conditions,
    icon: data.currentConditions.icon,
  };
}

async function getWeather(location, elements) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&contentType=json&key=${key}`
    );
    if (!response.ok) {
      throw new Error('Location not found');
    }
    const data = await response.json();
    const processedData = processWeatherData(data);
    renderWeather(processedData, elements.container);
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
}

const handleSearch = (elements) => {
  const { form, input } = elements;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;
    getWeather(city, elements);
  });
};

function renderWeather(weather, container) {
  container.innerHTML = '';
  const location = document.createElement('h2');
  const temp = document.createElement('p');
  const condition = document.createElement('p');

  location.textContent = weather.location;
  temp.textContent = `Temperature: ${weather.temperature}°C`;
  condition.textContent = `Condition: ${weather.condition}`;
  container.append(location, temp, condition);
}

handleSearch(elements);
