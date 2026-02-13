import './styles.css';
const elements = {
  container: document.getElementById('weather-display'),
  form: document.getElementById('search-form'),
  input: document.getElementById('city-input'),
  toggleBtn: document.getElementById('unit-toggle'),
};

let currentWeather = null;
let currentUnit = 'C';

function convertTemperature(temp, fromUnit, toUnit) {
  if (fromUnit === toUnit) return temp;
  if (fromUnit === 'C' && toUnit === 'F') {
    return (temp * 9) / 5 + 32;
  } else if (fromUnit === 'F' && toUnit === 'C') {
    return ((temp - 32) * 5) / 9;
  }
  return temp;
}

function toggleUnits() {
    elements.toggleBtn.addEventListener('click', () => {
        if(!currentWeather) return;
        currentUnit = currentUnit === 'C' ? 'F' : 'C';
        elements.toggleBtn.textContent = currentUnit === 'C' ? 'Switch to °F' : 'Switch to °C';
        renderWeather(currentWeather, elements.container);
    });
}

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
    elements.toggleBtn.disabled = true;
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&contentType=json&key=${key}`
    );
    if (!response.ok) {
      throw new Error('Location not found');
    }
    const data = await response.json();
    const processedData = processWeatherData(data);
    currentWeather = processedData;
    elements.toggleBtn.disabled = false;
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

  const displayTemp =
    currentUnit === 'C'
      ? weather.temperature
      : convertTemperature(weather.temperature, 'C', 'F');

  location.textContent = weather.location;
  temp.textContent = `Temperature: ${displayTemp.toFixed(1)}°${currentUnit}`;
  condition.textContent = `Condition: ${weather.condition}`;
  container.append(location, temp, condition);
}
elements.toggleBtn.disabled = true;
elements.toggleBtn.textContent = 'Switch to °F';
toggleUnits();
handleSearch(elements);
