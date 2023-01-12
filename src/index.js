import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  inputSearch: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputSearch.addEventListener(
  'input',
  debounce(onInputSearch, DEBOUNCE_DELAY)
);

function onInputSearch(e) {
  const name = e.target.value;

  if (name.length > 0 && name.trim() !== '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    fetchCountries(name);
  } else {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(name)
    .then(country => {
      countryMarkup(country);
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function countryMarkup(country) {
  const markup = country
    .map(elem => {
      return `<li style="list-style:none">
        <div style ="display:flex;gap:10px;align-items:center"><img src ="${elem.flags.svg}" alt ="${elem.name.common}" width="35px"><p style="font-size:25px;color:pink;margin:0">${elem.name.official}</p></div>
      </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;

  if (country.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    refs.countryList.style.visibility = 'hidden';
  }

  if (country.length <= 10 && country.length >= 2) {
    refs.countryList.style.visibility = 'visible';
    refs.countryInfo.innerHTML = '';
  }

  if (country.length === 1) {
    createMarkupInfo(country[0]);
  }
}

function createMarkupInfo(country) {
  const markupCountryInfo = `
        <p>
            <b>Capital</b>: ${country.capital}
        </p>
        <p>
            <b>Population</b>: ${country.population}
        </p>
        <p>
            <b>Languages</b>: ${Object.values(country.languages)}
        </p>`;
  refs.countryInfo.innerHTML = markupCountryInfo;
}