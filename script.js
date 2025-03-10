const searchForm = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-box input');

// remove default form submission behavior
searchForm.addEventListener('submit', e => e.preventDefault());

searchBtn.addEventListener('click', () => {
  const username =  searchInput.value;
  const promise = fetchUserData(username);

  promise
    .then(data => console.log(data))
    .catch(error => {
      console.error(`Can't find existing user: ${error}`);
      showUserError(username);
    });
})

async function fetchUserData(username) {
  let response;

  if (username === '') {
    // empty string default search behavior for local development purposes
    response = await fetch('local-assets/kamranahmedse.json');
  } else {
    response = await fetch(`https://api.github.com/users/${username}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

function showUserError(username) {
  const error = document.querySelector('.error');

  if (error) {
    error.parentNode.removeChild(error);
  }
  
  const newError = document.createElement('div');
  newError.setAttribute('class', 'error');
  newError.textContent = `${username} user not found.`;
  searchForm.appendChild(newError);
}