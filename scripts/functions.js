import { build } from './build.js';
import { ProfileImage } from './components/ProfileImage.js';
import { ProfileName } from './components/ProfileName.js';
import { ProfileStats } from './components/ProfileStats.js';
import { ProfileLink }  from './components/ProfileLink.js';
import { ProfileBio } from './components/ProfileBio.js';
import { ProfileAdditionalInfo } from './components/ProfileAdditionalInfo.js';
import { ReposSection } from './components/ReposSection.js';

export function basePath(path) {
  const host = document.location.hostname;

  if (host === 'denzellsilva.github.io') {
    const basePath = '/github-user-finder';
    return basePath + path;
  }

  return path;
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
  errorRemove();

  const primaryHeader = document.querySelector('.primary-header');
  
  const newError = build(['div', { class: 'error' }], 
  [
    build(['span'], [message]),
  ]);
  
  primaryHeader.appendChild(newError);
}

export function errorRemove() {
  const error = document.querySelector('.error');

  if (error) {
    error.parentNode.removeChild(error);
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