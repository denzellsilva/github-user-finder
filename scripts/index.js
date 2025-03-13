import * as functions from "./functions.js";

const searchForm = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-box input');
const sessionError = sessionStorage.getItem('error');

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
    .catch(() => {
      sessionStorage.setItem('error', 'User not found.');
      window.location.href = '/';
    });
  }
});

sessionStorage.clear();