import * as functions from "./functions.js";

const searchForm = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-box input');
const params = new URLSearchParams(window.location.search);
const user = params.get('user');

// whitelisting the url - redirect to '/' if the url doesn't have a 'user' parameter
if (!params.has('user') || user === '') {
  sessionStorage.setItem('error', 'Type a username.')
  window.location.href = '/';
}

functions.fetchUserData(user)
  .then((data) => {
    functions.populate(data);
    console.log(data);
  })
  .catch((e) => {
    functions.handleFetchError(e, () => {
      sessionStorage.setItem('error', 'User not found.');
      window.location.href = '/';
    });
  });

// remove default form submission behavior
searchForm.addEventListener('submit', e => e.preventDefault());

searchBtn.addEventListener('click', () => {
  const username =  searchInput.value.toString();

  if (username === '') {
    functions.errorShow('Type a username.');
  } else {
    const promise = functions.fetchUserData(username);
  
    promise
    .then(() => {
      window.location.href = `/profile.html?user=${username}`;
    })
    .catch((e) => {
      functions.handleFetchError(e, () => functions.errorShow('User not found.'));
    });
  }
});