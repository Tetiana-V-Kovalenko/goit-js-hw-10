import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
let debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const inputSearchBox = document.querySelector('#search-box');
export const listOfCountries = document.querySelector('.country-list');
export const countryInfo = document.querySelector('.country-info');

inputSearchBox.addEventListener(
  'input',
  debounce(onInputSearchBox, DEBOUNCE_DELAY)
);

function onInputSearchBox() {
  const searchedName = inputSearchBox.value.trim();
  listOfCountries.innerHTML = '';
  countryInfo.innerHTML = '';
  if (searchedName.length === 0) {
    return;
  }
  fetchCountries(searchedName)
    .then(countries => {
      const searchedCountry = countries[0];

      if (countries.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return;
      }

      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length >= 2) {
        showListOfCountries(countries);
      }
      if (countries.length === 1) {
        showCountryCard(searchedCountry);
      }
    })
    .catch(err => console.log(err));
}

function showListOfCountries(countries) {
  let listOfCountriesHTML = ``;
  countries.map(country => {
    listOfCountriesHTML += `<li class="country-item"><img src="${country.flags.svg}" alt="${country.name}"><p>${country.name}</p></li>`;
  });

  listOfCountries.insertAdjacentHTML('afterbegin', listOfCountriesHTML);
  return;
}

function showCountryCard(country) {
  let countryCard = `<h1 class="country-title"><img src="${
    country.flags.svg
  }" alt="${country.name}">${country.name}</h1>
      <p class="font_style">Capital: <span>${country.capital}</span></p>
      <p class="font_style">Population: <span>${country.population}</span></p>
      <p class="font_style">Languages: <span>${country.languages
        .map(language => {
          return language.name;
        })
        .join(', ')} </span></p>`;
  countryInfo.insertAdjacentHTML('afterbegin', countryCard);
}
