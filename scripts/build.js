// returns the line where a function is called,
export function functionCallLine() {
	const error = new Error();
	const stackLine = error.stack.split("\n")[2]; // Get the caller's stack trace
	return stackLine.trim();
}

// || The Build Function
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

// loops through the structure array and appends every node to the element
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
	// updates previousNode value with the current value of node before iterating to the next loop
	previousNode = node;
}

return element;
}