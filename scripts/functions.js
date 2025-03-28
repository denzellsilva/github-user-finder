export async function fetchData(request) {
 const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchAll(requests) {
  const reponses = await Promise.all(requests)

  for (const response of reponses) {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
  }
  
  const data = await Promise.all(reponses.map((response) => response.json()));
  return data;
}

export function populate([data, userRepos]) {
  const main = document.querySelector('main');
  const popularRepos = userRepos.items.slice(0, 6);

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
        AdditionalInfo(data),
      ])
    ]),
    ReposSection(popularRepos),
  ]);

  main.appendChild(content);
}

function ProfileImage(data) {
  return build(['img', { src: data['avatar_url'] }]);
}

function ProfileName(data) {
  return build(['header'], 
  [
    build(['h1'], [data['name']])
  ]);
}

function ProfileLink(data) {
  return build(['h2'], 
  [ 
    build(['a', {href: `https://github.com/${data['login']}`, target: `blank`}], [`@${data['login']}`])
  ]);
}

function ProfileBio(data) {
  return build(['p'], [data['bio']]);
}

function ProfileStats(data) {
  return build(['ul'],
  [
    build(['li'], [`Repos: ${data['public_repos']}`]),
    build(['li'], [`Followers: ${data['followers']}`]),
    build(['li'], [`Following: ${data['following']}`]),
  ]);
}

function AdditionalInfo(data) {
  return build(['ul'], 
  [
    data['location'] && build(['li'], 
    [
      `Location: ${data['location']}`
    ]),
    
    data['company'] && build(['li'], 
    [
      `Company: ${data['company']}`,
    ]),

    data['blog'] && build(['li'], 
    [
      'Blog: ', build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
    ]),

    data['twitter_username'] && build(['li'], 
    [
      'Twitter: ', build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username'],]),
    ]),
  ]);
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

function ReposSection(repos) {
  repos = repos.map((repo) => {
    const repoStars = roundNumber(repo['stargazers_count']);

    const listItem = build(['li'], 
    [
      build(['a', { href: repo['html_url'], target: 'blank' }], [repo['name']]),
      build(['p'], [`Stars: ${repoStars}`]),
      repo['language'] && build(['p'], [repo['language']]),
      repo['description'] && build(['p'], [repo['description']]),
    ]);

    return listItem;
  });

  const section = build(['section', { class: 'repos' }], 
  [
    build(['h2'], ['Repositories']),
    build(['ul'], [...repos])
  ]);
  
  return section;
}

export function errorShow(message = 'Invalid input.') {
  errorRemove();

  const searchForm = document.querySelector('.search-box');

  // Refactor this to use the build function
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

// handles errors in fetching data
export function handleFetchError(error, func) {
  if (error.message === 'HTTP error: 404' || error.message === 'HTTP error: 422') {
    func();
  } else if (error.message === 'HTTP error: 403') {
    errorShow('API rate limit exceeded. Try again later.');
  } else {
    console.log(error);
  }
}

// returns the line where a funciton is called,
export function functionCallLine() {
  const error = new Error();
  const stackLine = error.stack.split("\n")[2]; // Get the caller's stack trace
  return stackLine.trim();
}

// || The Build Functions
export function build([tag, attributes = {}], structure = []) {
  const element = document.createElement(tag);

  // checks if it's a valid html tag
  if (element.toString() === '[object HTMLUnknownElement]') {
    console.error(`Invalid HTML tag: ${tag} in build(). Called at: ${functionCallLine()}`);
    return;
  }

  // loops through the attributes object and checks every attribute if it's a valid html attribute or else show an error
  for (const attribute in attributes) {
    if (attribute === 'class') {
      element.className = attributes[attribute];
    } else if (attribute in element || attribute.startsWith('data-')) {
      element.setAttribute(attribute, attributes[attribute]);
    } else {
      console.error(`Invalid attribute: ${attribute} for tag <${tag}> in build(). Called at: ${functionCallLine()}`);
      return;
    }
  }

  // loops through the stucture array and appends every node to the element
  let previousNode; // tracks previous node
  for (const node of structure) {
    if (!node) {
      continue;
    } else if (node instanceof HTMLElement) {
      // append the node if its an html element
      element.appendChild(node);
    } else if (typeof node === 'string') {
      let textNode;
      // if the previous node is a text, add a single space on creating the text node.
      typeof previousNode === 'string' ? textNode = document.createTextNode(` ${node}`) : textNode = document.createTextNode(node);
      element.appendChild(textNode);
    } else {
      console.error(`Invalid HTML node in array: ${node} in build(). Called at: ${functionCallLine()}`);
    }
    // updates previousNode value witht the current value of node before iterating to the next loop
    previousNode = node;
  }

  return element;
}

export function hideLoader() {
  const loader = document.querySelector('.cssload-container');
  loader.parentNode.removeChild(loader);
}