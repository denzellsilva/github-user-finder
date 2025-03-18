export async function fetchUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export function errorShow(message = 'Invalid input.') {
  errorRemove();

  const searchForm = document.querySelector('.search-box');
  const newError = document.createElement('span');
  
  newError.setAttribute('class', 'error');
  newError.textContent = message;
  
  searchForm.appendChild(newError);
}

export function errorRemove() {
  const error = document.querySelector('.error');

  if (error) {
    error.parentNode.removeChild(error);
  }
}

export function removeOldContent() {
  const main = document.querySelector('main');

  if (main) {
    main.parentNode.removeChild(main);
  }
}

export function populate(data) {
  removeOldContent();
  
  const body = document.querySelector('body');
  const newMain = document.createElement('main');
  const img = document.createElement('img');
  const section = document.createElement('section');

  img.setAttribute('src', data['avatar_url']);
  img.setAttribute('alt', `${data['login']}'s github profile picture.`);
  
  section.appendChild(buildFullName(data['name']));
  section.appendChild(buildAccountStats( {repos: data['public_repos'], followers: data['followers'], following: data['following']} ));

  newMain.appendChild(img);
  newMain.appendChild(section);

  body.appendChild(newMain);
}

function buildFullName(name) {
  const h2 = document.createElement('h2');

  h2.textContent = name;
  return h2;
}

function buildAccountStats(stats) {
  const list = document.createElement('ul');

  for (const attribute in stats) {
      const item = document.createElement('li');
      item.textContent = `${attribute}: ${stats[attribute]}`;
      list.appendChild(item);
    }
    
  return list;
}

export function handleFetchError(error, func) {
  if (error.message === 'HTTP error: 404') {
    func();
  } else {
    console.log(error);
  }
}