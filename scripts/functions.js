export async function fetchData(request) {
  const response = await fetch(request);
  // const response = await fetch('local-assets/kamranahmedse.json');
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export function populate(data) {
  const main = document.querySelector('main');

  const content = build(['div', { class: 'content'}], 
  [
    ProfileImage(data),
    ProfileName(data),
    ProfileStats(data),
    ProfileLink(data),
    ProfileBio(data),
    AdditionalInfo(data),
  ]);

  const popularReposUrl = `https://api.github.com/search/repositories?q=user:${data['login']}&sort=stars&order=desc`;
  const promise = fetchData(popularReposUrl);

  promise
    .then((repos) => {
      const popularRepos = repos.items.slice(0, 6);
      const section = build(['section', { class: 'repos' }], 
      [
        build(['h2'], ['Repositories']),
        RepositoriesList(popularRepos),
      ]);
      
      main.appendChild(section);
    })
    .catch((e) => {
      handleFetchError(e, () => {
        console.log('User has no repositories to show.');
      });
    });

    main.appendChild(content);
}

function ProfileImage(data) {
  return build(['img', { src: data['avatar_url'] }]);
}

function ProfileName(data) {
  return build(['h1'], [data['name']]);
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

function RepositoriesList(repos) {
  function buildListItem(repo) {
    const listItem = build(['li'], 
    [
      build(['a', { href: repo['html_url'], target: 'blank' }], [repo['name']]),
    ]);

    fetchData(repo['languages_url'])
      .then((languages) => {
        const mainLanguage = Object.keys(languages)[0];
        
        if (mainLanguage) {
          listItem.appendChild(build(['p'], [mainLanguage]));
        }
      })
      .catch((e) => {
        handleFetchError(e, () => {
          console.log('User has no languages to show.');
        });
      })
      .then(() =>{
        listItem.appendChild(build(['p'], [repo['description']]));
      });


    return listItem;
  }

  repos = repos.map(buildListItem);

  return build(['ul'], [...repos]);
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

// handles errors in fetching data
export function handleFetchError(error, func) {
  if (error.message === 'HTTP error: 404' || error.message === 'HTTP error: 422' || error.message === 'HTTP error: 403') {
    func();
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