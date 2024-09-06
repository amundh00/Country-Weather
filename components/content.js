import { fetchCountries } from '../api/countries.js';
import { fetchWeather } from '../api/weather.js';

export async function createContent() {
  const content = document.createElement('main');
  content.classList.add('content');

  // Create the search bar
  const searchBar = document.createElement('input');
  searchBar.setAttribute('type', 'text');
  searchBar.setAttribute('id', 'country-search');
  searchBar.setAttribute('placeholder', 'Search for a country...');
  
  // Append the search bar to the content
  content.appendChild(searchBar);

  // Fetch and display country data
  const countries = await fetchCountries();

  const countryList = document.createElement('ul');
  countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

  // Function to render the country list
  function renderCountryList(filteredCountries) {
    // Clear the existing list
    countryList.innerHTML = '';

    // Render the filtered list
    filteredCountries.forEach((country) => {
      const li = document.createElement('li');
      li.textContent = country.name.common;

      // Create a div to display weather information
      const weatherDiv = document.createElement('div');
      weatherDiv.classList.add('weather-info');
      weatherDiv.textContent = 'Click to see the weather';
      li.appendChild(weatherDiv);

      // Event listener to fetch weather when country is clicked
      li.addEventListener('click', async () => {
        if (country.capitalInfo && country.capitalInfo.latlng) {
          const [lat, lon] = country.capitalInfo.latlng;
          const weather = await fetchWeather(lat, lon);
          weatherDiv.textContent = `Weather in ${country.capital ? country.capital[0] : 'Capital'}: ${
            weather.current_weather.temperature
          }°C, Weather Code: ${weather.current_weather.weathercode}`;
        } else {
          weatherDiv.textContent = 'Weather data not available for this country.';
        }
      });

      countryList.appendChild(li);
    });
  }

  // Initial rendering of the countries
  renderCountryList(countries);

  // Append the country list to the content
  content.appendChild(countryList);

  // Search functionality
  searchBar.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(query)
    );
    renderCountryList(filteredCountries);
  });

  return content;
}
