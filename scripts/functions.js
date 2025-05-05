import { build } from './build.js';
import { ProfileImage } from './components/ProfileImage.js';
import { ProfileName } from './components/ProfileName.js';
import { ProfileStats } from './components/ProfileStats.js';
import { ProfileLink }  from './components/ProfileLink.js';
import { ProfileBio } from './components/ProfileBio.js';
import { ProfileAdditionalInfo } from './components/ProfileAdditionalInfo.js';
import { ReposSection } from './components/ReposSection.js';

// returns the right path for the current basepath
function getPath(basePath, path) {
  if (path === '/') {
    return basePath;
  }

  // if the path starts with a slash, remove it and add it to the base path
  if (path.startsWith('/')) {
    path = path.slice(1);
    return basePath + path;
  }

  return basePath + path;
}

export function basePath(path = '/') {
  const host = document.location.hostname;
  let basePath;

  // get the right path for the current host
  if (host === 'denzellsilva.github.io') {
    basePath = '/github-user-finder/';
    return getPath(basePath, path);
  }

  basePath = '/';
  return getPath(basePath, path);
}

export async function fetchUser(request) {
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.ok;
}

export async function fetchAll(requests) {
  const responses = await Promise.all(requests)

  // check only the first response for errors because the other request is not needed if it fails
  if (!responses[0].ok) {
    throw new Error(`HTTP error: ${responses[0].status}`);
  }

  const data = await Promise.all(responses.map(response => response.json()));
  return data;
}

export function populate([data, userRepos]) {
  const main = document.querySelector('main');

  const content = build(['div', { class: 'content'}], 
  [
    build(['header', { class: 'profile-header' }], 
    [
      ProfileImage(data),
      build(['section', { class: 'profile-info' }], 
      [
        ProfileName(data),
        ProfileStats(data),
        ProfileLink(data),
        ProfileBio(data),
        ProfileAdditionalInfo(data),
      ])
    ])
  ]);

  main.appendChild(content);

  // only show the repos section if there are any repos
  if (userRepos.items) {
    const popularRepos = userRepos.items.slice(0, 6);
    const reposSection = ReposSection(popularRepos);
    main.appendChild(reposSection);
  }
}

export function roundNumber(number) {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1) + 'M';
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1) + 'k';
  } else {
    return Math.round(number).toString();
  }
}

export function errorShow(message = 'Invalid input.') {
  const searchBox = document.querySelector('.search-box');
  const newError = build(['span', {class: 'error'}], [message]);
  const primaryHeader = document.querySelector('.populated .primary-header'); // only reference the primary header in populated body

  errorRemove();

  // Add a delay in appending newError so that the removal of the old error is noticeable, this would create a flicker effect
  setTimeout(() => {
    // this only works on the populated body
    if (primaryHeader && !primaryHeader.getAttribute('class').includes('with-error')) {
      primaryHeader.className = `${primaryHeader.getAttribute('class')} with-error`;
    }
  
    searchBox.appendChild(newError);
  }, 20);

  // remove the error after 5 seconds
  setTimeout(() => {
    errorRemove(newError);
  }, 5000);
}

export function errorRemove(error = document.querySelector('.error')) {
  const primaryHeader = document.querySelector('.populated .primary-header'); // only reference the primary header in populated body

  // check if the error exists because sometimes we call this function before the error is created
  // check also the parent node of the error if it exists because the error might not be in the DOM anymore
  if (!(error && error.parentNode)) {
    return;
  }

  error.parentNode.removeChild(error);

  // this only works on the populated body
  if (primaryHeader && primaryHeader.getAttribute('class').includes('with-error')) {
    primaryHeader.className = primaryHeader.getAttribute('class').replace('with-error', '').trim();
  }
}

// handles errors in fetching data
export function handleFetchError(error, func) {
  switch (error.message) {
    case 'HTTP error: 404':
      // call the callback function if the error is 404 - this means the user is not found
      func();
      break;

    case 'HTTP error: 422':
      // 422 error means the resources do not exist or you do not have permission to view them
      console.error('The resources do not exist or you do not have permission to view them.');
      break;

    case 'HTTP error: 403':
      // 403 error means the API rate limit has been exceeded
      errorShow('API rate limit exceeded. Try again later.');
      break;

    case 'Failed to fetch':
      sessionStorage.setItem('error', `${error.message} due to possibly poor connection.`);
      window.location.href = basePath('/');
      break;

    default:
      // other errors are logged to the console
      console.log(error);
      break;
  }
}

export function hideLoader() {
  const loader = document.querySelector('.cssload-container');
  loader.parentNode.removeChild(loader);
}

export function isValidGitHubUsername(username) {
  // GitHub username regex: 1-39 characters, alphanumeric, allow hyphens but no consecutive hyphens (--), or no hyphens at the beginning or end of the username.
  const usernameRegex = /^(?!-)(?!.*--)[a-zA-Z0-9-]{1,39}(?<!-)$/;
  return usernameRegex.test(username);
}