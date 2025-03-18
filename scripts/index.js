import * as functions from "./functions.js";

const searchForm = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-box input');
const sessionError = sessionStorage.getItem('error');
const params = new URLSearchParams(window.location.search);

// whitelisting the url - redirect to '/' if the url doesn't have parameters
if (params.toString()) {
  window.location.href = '/';
}

// flash the value of error there is an error key in the session storage
if (sessionError) {
  functions.errorShow(sessionError);
}

// remove default form submission behavior
searchForm.addEventListener('submit', e => e.preventDefault());

searchBtn.addEventListener('click', () => {
  const username =  searchInput.value.toString();

  if (username === '') {
    sessionStorage.setItem('error', 'Type a username.');
    window.location.href = '/';
  } else {
    const promise = functions.fetchUserData(username);
  
    promise
    .then(() => {
      window.location.href = `/profile.html?user=${username}`;
    })
    .catch((e) => {
      functions.handleFetchError(e, () => {
        sessionStorage.setItem('error', 'User not found.');
        window.location.href = '/';
      });
    });
  }
});

sessionStorage.clear();