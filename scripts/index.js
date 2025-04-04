import { basePath, fetchData, errorShow, handleFetchError } from "./functions.js";

const searchForm = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-box input');
const sessionError = sessionStorage.getItem('error');
const params = new URLSearchParams(window.location.search);

// whitelisting the url - redirect to '/' if the url have parameters
if (params.toString()) {
  window.location.href = basePath('/');
}

// flash the value of error there is an error key in the session storage
if (sessionError) {
  errorShow(sessionError);
}

// remove default form submission behavior
searchForm.addEventListener('submit', e => e.preventDefault());

searchBtn.addEventListener('click', () => {
  const username =  searchInput.value.toString();

  if (username === '') {
    sessionStorage.setItem('error', 'Type a username.');
    window.location.href = basePath('/');
  } else {
    // const userUrl = `../local-assets/kamranahmedse.json`;
    const userUrl = `https://api.github.com/users/${username}`;
    const promise = fetchData(userUrl);

    promise
    .then(() => {
      window.location.href = basePath(`/profile.html?user=${username}`);
    })
    .catch((e) => {
      handleFetchError(e, () => {
        sessionStorage.setItem('error', 'User not found.');
        window.location.href = basePath('/');
      });
    });
  }
});

sessionStorage.clear();