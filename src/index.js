import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
let debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const inputSearchBox = document.querySelector('#search-box');
export const listOfCountry = document.querySelector('.country-list');
export const countryInfo = document.querySelector('.country-info');

inputSearchBox.addEventListener(
  'input',
  debounce(onInputSearchBox, DEBOUNCE_DELAY)
);

function onInputSearchBox() {
  const searchedName = inputSearchBox.value.trim();
  listOfCountry.innerHTML = '';
  countryInfo.innerHTML = '';
  fetchCountries(searchedName)
    .then(country => {
      console.log(country);
      const arrOfCountry = country;
      const searchedCountry = arrOfCountry[0];
      if (arrOfCountry.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return;
      }

      if (arrOfCountry.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (arrOfCountry.length >= 2) {
        let listOfCountriesHTML = ``;
        arrOfCountry.map(el => {
          listOfCountriesHTML += `<li class="country-item"><img src="${el.flags.svg}" alt="${el.name}"><p>${el.name}</p></li>`;
        });
        console.log(listOfCountriesHTML);
        listOfCountry.insertAdjacentHTML('afterbegin', listOfCountriesHTML);
        return;
      } else if (arrOfCountry.length === 1) {
        let itemOfCountry = `<h1 class="country-title"><img src="${
          searchedCountry.flags.svg
        }" alt="${searchedCountry.name}">${searchedCountry.name}</h1>
        <p class="font_style">Capital: <span>${
          searchedCountry.capital
        }</span></p>
        <p class="font_style">Population: <span>${
          searchedCountry.population
        }</span></p>
        <p class="font_style">Languages: <span>${searchedCountry.languages
          .map(el => {
            return el.name;
          })
          .join(', ')} </span></p>`;
        countryInfo.insertAdjacentHTML('afterbegin', itemOfCountry);
      }
    })
    .catch(err => console.log(err));
}
