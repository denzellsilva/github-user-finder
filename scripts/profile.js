import * as functions from "./functions.js";
import { basePath } from "./functions.js";

const searchForm = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-box input');
const params = new URLSearchParams(window.location.search);
const user = params.get('user');
const userUrl = 'https://api.github.com/users/';
const reposUrl = `https://api.github.com/search/repositories?q=user:${user}&sort=stars&order=desc`;
// const user = `kamranahmedse.json`;
// const userUrl = `../local-assets/`;
// const reposUrl = `../local-assets/kamranahmedse-repos.json`;

// whitelisting the url - redirect to '/' if the url doesn't have a 'user' parameter
if (!params.has('user') || user === '') {
  sessionStorage.setItem('error', 'Type a username.')
  window.location.href = basePath('/');
}

functions.fetchAll([fetch(userUrl + user), fetch(reposUrl)])
  .then((data) => {
    functions.hideLoader();
    functions.populate(data);
  })
  .catch((e) => {
    functions.handleFetchError(e, () => {
      sessionStorage.setItem('error', 'User not found.');
      window.location.href = basePath('/');
    });
  });

// remove default form submission behavior
searchForm.addEventListener('submit', e => e.preventDefault());

searchBtn.addEventListener('click', () => {
  const username =  searchInput.value.toString();

  if (username === '') {
    functions.errorShow('Type a username.');
  } else {
    const promise = functions.fetchData(userUrl + username);
  
    promise
    .then(() => {
      window.location.href = basePath(`/profile.html?user=${username}`);
    })
    .catch((e) => {
      functions.handleFetchError(e, () => functions.errorShow('User not found.'));
    });
  }
});


console.log(document.location.hostname);