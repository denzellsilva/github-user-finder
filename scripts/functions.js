export async function fetchUserData(username) {
  // const response = await fetch(`https://api.github.com/users/${username}`);
  const response = await fetch('local-assets/kamranahmedse.json')
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

export function populate(data) {
  const main = document.querySelector('main');

  const content =
  build(['div', { class: 'content'}], 
  [
    ProfileImage(data),
    ProfileName(data),
    ProfileStats(data),
    ProfileLink(data),
    ProfileBio(data),
    AdditionalInfo(data),
  ]);
  
  main.appendChild(content);
}

function ProfileImage(data) {
  return build(['img', { src: data['avatar_url'] }]);
}

function ProfileName(data) {
  return build(['h2'], [data['name']]);
}

function ProfileLink(data) {
  return build(['h3'], 
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
    build(['li'], [`Location: ${data['location']}`]),
    // The spread operator is used to flatten the conditional arrays into the parent array. If the condition is true, 
    // the array is spread into the parent array. If the condition is false, an empty array ([]) is spread, which has no effect.
    ...(data['blog'] 
      ? [
        build(['li'], 
        [
          'Blog: ',
          build(['a'], [data['blog']]),
        ])
      ]
      : []),

    ...(data['company'] 
    ? [
      build(['li'], 
      [
        'Company',
        build(['a'], [data['company']]),
      ])
    ]
    : []),

    ...(data['twitter_username'] 
    ? [
      build(['li'], 
      [
        'Twitter: ',
        build(['a', {href: `https://x.com/${data['twitter_username']}`, target: 'blank'}], [data['twitter_username']]),
      ])
    ]
    : []),
  ]);
}

// handles errors in fetching data
export function handleFetchError(error, func) {
  if (error.message === 'HTTP error: 404') {
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

// || The Build Framework
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
    if (node instanceof HTMLElement) {
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