import { basePath, fetchAll, fetchUser, errorShow, handleFetchError, hideLoader, populate, isValidGitHubUsername } from "./functions.js";

const searchForm = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-box input');
const params = new URLSearchParams(window.location.search);
const homeLinks = document.querySelectorAll('.home-link');
const user = params.get('user');
const userUrl = 'https://api.github.com/users/';
const reposUrl = `https://api.github.com/search/repositories?q=user:${encodeURIComponent(user)}&sort=stars&order=desc`;
// const user = `kamranahmedse.json`;
// const userUrl = `../local-assets/`;
// const reposUrl = `../local-assets/kamranahmedse-repos.json`;

// whitelisting the url - redirect to '/' if the url doesn't have a 'user' parameter
if (!params.has('user') || user === '') {
  sessionStorage.setItem('error', 'Type a username.')
  window.location.href = basePath('/');
}

if (!isValidGitHubUsername(user)) {
  sessionStorage.setItem('error', 'Invalid username.');
  window.location.href = basePath('/');
}

fetchAll([fetch(userUrl + user), fetch(reposUrl)])
  .then((data) => {
    hideLoader();
    populate(data);
  })
  .catch((e) => {
    handleFetchError(e, () => {
      sessionStorage.setItem('error', 'User not found.');
      window.location.href = basePath('/');
    });
  });

for (const link of homeLinks) {
  link.addEventListener('click', () => {
    window.location.href = basePath('/');
  });
}

// remove default form submission behavior
searchForm.addEventListener('submit', e => e.preventDefault());

searchBtn.addEventListener('click', () => {
  const username =  searchInput.value.toString().replaceAll(' ', '');

  if (username === '') {
    errorShow('Type a username.');
  } else if (!isValidGitHubUsername(username)) {
    errorShow('Invalid username.');
  } else {
    const promise = fetchUser(userUrl + username);
  
    promise
    .then(() => {
      window.location.href = basePath(`profile.html?user=${username}`);
    })
    .catch((e) => {
      handleFetchError(e, () => errorShow('User not found.'));
    });
  }
});