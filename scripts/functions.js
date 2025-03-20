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
  const section = document.createElement('section');
  
  const img = buildElement({
    tag: 'img',
    attributes: {
      src: data['avatar_url'],
      alt: `${data['login']}'s github profile picture.`
    }
  });

  section.appendChild(buildFullName(data['name']));
  section.appendChild(buildAccountStats( {repos: data['public_repos'], followers: data['followers'], following: data['following']} ));

  main.appendChild(img);
  main.appendChild(section);
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

// returns the line where a funciton is called,
export function functionCallLine() {
  const error = new Error();
  const stackLine = error.stack.split("\n")[2]; // Get the caller's stack trace
  return stackLine.trim();
}

export function buildElement({tag, attributes = {}}, structure = []) {
  const element = document.createElement(tag);

  // checks if it's a valid html tag
  if (element.toString() === '[object HTMLUnknownElement]') {
    console.error(`Invalid HTML tag: ${tag} in buildElement(). Called at: ${functionCallLine()}`);
    return;
  }

  // loops through the attributes object and checks every attribute if it's a valid html attribute or else show an error
  for (const attribute in attributes) {
    if (attribute === 'class') {
      element.className = attributes[attribute];
    } else if (attribute in element || attribute.startsWith('data-')) {
      element.setAttribute(attribute, attributes[attribute]);
    } else {
      console.error(`Invalid attribute: ${attribute} for tag <${tag}> in buildElement(). Called at: ${functionCallLine()}`);
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
      console.error(`Invalid HTML node in array: ${node} in buildElement(). Called at: ${functionCallLine()}`);
    }
    previousNode = node;
  }

  return element;
}